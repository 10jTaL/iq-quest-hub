import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { QuizConfig } from "@/types/quiz"; // ✅ plus de mockQuizzes
import QuizIntro from "@/components/QuizIntro";
import QuizQuestion from "@/components/QuizQuestion";
import QuizResults from "@/components/QuizResults";
import QuizStats from "@/components/QuizStats";
import { ArrowLeft, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/contexts/UserContext";
import { useOidc, useOidcAccessToken } from "@axa-fr/react-oidc"; 

type Phase = "intro" | "questions" | "results";

const QuizPage = () => {
  const { logout } = useOidc();
  const { accessTokenPayload } = useOidcAccessToken();
  const email = accessTokenPayload?.upn ?? accessTokenPayload?.unique_name ?? accessTokenPayload?.email;
  const { slug } = useParams<{ slug: string }>();
  const [quiz, setQuiz] = useState<QuizConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const { role } = useUser();
  const [phase, setPhase] = useState<Phase>("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showStats, setShowStats] = useState(false);
  const canViewStats = role === "administrateur" || role === "maitre_du_jeu";
  const [previousResult, setPreviousResult] = useState<{
    score: number;
    total_questions: number;
    percentage: number;
    completed_at: string;
  } | null>(null);

  const defaultResultMessages = [
    { minScore: 0,  maxScore: 40,  title: "À renforcer",   message: "Continuez à vous former." },
    { minScore: 41, maxScore: 70,  title: "Bon niveau",    message: "Vous avez de bonnes bases." },
    { minScore: 71, maxScore: 100, title: "Excellent !",   message: "Bravo, vous maîtrisez le sujet !" },
  ];
  // Charger le résultat précédent
  useEffect(() => {
    if (!slug || !email) return;
    fetch(`/api/participations/${slug}?email=${encodeURIComponent(email)}`)
      .then(r => r.json())
      .then(data => { if (data) setPreviousResult(data); });
  }, [slug, email]);

  // Sauvegarder quand le quiz est terminé
  useEffect(() => {
    if (phase !== 'results' || !email || !quiz) return;
    fetch('/api/participations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        quiz_slug: slug,
        score,
        total_questions: quiz.questions.length,
      })
    });
  }, [phase]);
  useEffect(() => {
    async function fetchQuiz() {
      try {
        const response = await fetch(`/api/quiz/${slug}`);
        if (response.status === 404) { setNotFound(true); return; }
        if (!response.ok) throw new Error("Erreur API");
        const data: QuizConfig = await response.json();
        setQuiz(data);
      } catch (error) {
        console.error("Erreur chargement quiz", error);
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    }
    if (slug) fetchQuiz();
  }, [slug]);

  if (isLoading) return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-primary" />
    </div>
  );

  if (notFound || !quiz) return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="mb-2 font-heading text-2xl font-bold text-foreground">Quiz introuvable</h1>
        <Link to="/" className="text-primary hover:underline">Retour à l'accueil</Link>
      </div>
    </div>
  );

  const handleStart = () => setPhase("questions");

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (currentQuestion + 1 >= quiz.questions.length) {
      setPhase("results");
    } else {
      setCurrentQuestion((c) => c + 1);
    }
  };

  const handleRestart = () => {
    setPhase("intro");
    setCurrentQuestion(0);
    setScore(0);
    // Recharger le résultat précédent (qui vient d'être sauvegardé)
    if (slug && email) {
      fetch(`/api/participations/${slug}?email=${encodeURIComponent(email)}`)
        .then(r => r.json())
        .then(data => { if (data) setPreviousResult(data); });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Link>
          {canViewStats && (
            <Button
              variant={showStats ? "default" : "outline"}
              size="sm"
              className="gap-2 rounded-full"
              onClick={() => setShowStats((s) => !s)}
            >
              <BarChart3 className="h-4 w-4" />
              Statistiques
            </Button>
          )}
        </div>
      </header>

      <main className="container py-16">
        <AnimatePresence mode="wait">
          {phase === "intro" && (
            <div key="intro">  {/* ← key ajoutée */}
              {previousResult && (
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700">
                  🎯 Votre dernier résultat : <strong>{previousResult.score}/{previousResult.total_questions}</strong>
                  {" "}({previousResult.percentage}%)
                  <span className="ml-2 text-blue-400 text-xs">
                    le {new Date(previousResult.completed_at).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              )}
              <QuizIntro
                key="intro"
                title={quiz.title}
                introduction={quiz.introduction}
                questionCount={quiz.questions.length}
                icon={quiz.icon}
                onStart={handleStart}
              />
            </div>
          )}
          {phase === "questions" && (
            <QuizQuestion
              key={`q-${currentQuestion}`}
              question={quiz.questions[currentQuestion]}
              questionNumber={currentQuestion + 1}
              totalQuestions={quiz.questions.length}
              onAnswer={handleAnswer}
              onNext={handleNext}
            />
          )}
          {phase === "results" && (
            <QuizResults
              key="results"
              score={score}
              totalQuestions={quiz.questions.length}
              resultMessages={quiz.resultMessages ?? defaultResultMessages}
              onRestart={handleRestart}
            />
          )}
        </AnimatePresence>

        {/* Stats panel for privileged users */}
        {canViewStats && showStats && slug && (
          <div className="mt-12 border-t border-border pt-10">
            <QuizStats quizSlug={slug} />
          </div>
        )}
      </main>
    </div>
  );
};

export default QuizPage;
