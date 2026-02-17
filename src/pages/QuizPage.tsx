import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { mockQuizzes } from "@/data/mockQuizzes";
import QuizIntro from "@/components/QuizIntro";
import QuizQuestion from "@/components/QuizQuestion";
import QuizResults from "@/components/QuizResults";
import { ArrowLeft } from "lucide-react";

type Phase = "intro" | "questions" | "results";

const QuizPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const quiz = mockQuizzes.find((q) => q.slug === slug);

  const [phase, setPhase] = useState<Phase>("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);

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
        <div className="container flex h-16 items-center">
          <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Link>
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
      </main>
    </div>
  );
};

export default QuizPage;
