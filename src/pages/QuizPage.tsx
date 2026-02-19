import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { mockQuizzes } from "@/data/mockQuizzes";
import QuizIntro from "@/components/QuizIntro";
import QuizQuestion from "@/components/QuizQuestion";
import QuizResults from "@/components/QuizResults";
import QuizStats from "@/components/QuizStats";
import { ArrowLeft, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteConfig } from "@/types/quiz";

const isPrivilegedUser = (): boolean => {
  try {
    const stored = localStorage.getItem("siteConfig");
    if (!stored) return false;
    const config: SiteConfig = JSON.parse(stored);
    // For demo: check if any role user is admin or maitre_du_jeu
    return config.roleUsers.some(
      (u) => u.role === "administrateur" || u.role === "maitre_du_jeu"
    );
  } catch {
    return false;
  }
};

type Phase = "intro" | "questions" | "results";

const QuizPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const quiz = mockQuizzes.find((q) => q.slug === slug);

  const [phase, setPhase] = useState<Phase>("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showStats, setShowStats] = useState(false);
  const canViewStats = isPrivilegedUser();

  if (!quiz) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-2 font-heading text-2xl font-bold text-foreground">Quiz introuvable</h1>
          <Link to="/" className="text-primary hover:underline">Retour à l'accueil</Link>
        </div>
      </div>
    );
  }

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
            <QuizIntro
              key="intro"
              title={quiz.title}
              introduction={quiz.introduction}
              questionCount={quiz.questions.length}
              icon={quiz.icon}
              onStart={handleStart}
            />
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
              resultMessages={quiz.resultMessages}
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
