import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { QuizQuestion as QuizQuestionType } from "@/types/quiz";
import { Check, X } from "lucide-react";

interface QuizQuestionProps {
  question: QuizQuestionType;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (isCorrect: boolean) => void;
  onNext: () => void;
}

const QuizQuestion = ({ question, questionNumber, totalQuestions, onAnswer, onNext }: QuizQuestionProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [hasValidated, setHasValidated] = useState(false);

  const handleValidate = () => {
    if (!selectedAnswer) return;
    const answer = question.answers.find(a => a.id === selectedAnswer);
    setHasValidated(true);
    onAnswer(answer?.isCorrect ?? false);
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setHasValidated(false);
    onNext();
  };

  const correctAnswerId = question.answers.find(a => a.isCorrect)?.id;

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-2xl"
    >
      {/* Progress */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
          <span>Question {questionNumber}/{totalQuestions}</span>
          <span>{Math.round((questionNumber / totalQuestions) * 100)}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={{ width: `${((questionNumber - 1) / totalQuestions) * 100}%` }}
            animate={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Question */}
      <h2 className="mb-8 font-heading text-xl font-semibold text-foreground md:text-2xl">
        {question.question}
      </h2>

      {/* Answers */}
      <div className="mb-8 space-y-3">
        {question.answers.map((answer, i) => {
          let borderClass = "border-border hover:border-primary/40";
          let bgClass = "bg-card";
          let iconEl: React.ReactNode = null;

          if (hasValidated) {
            if (answer.id === correctAnswerId) {
              borderClass = "border-success";
              bgClass = "bg-success/10";
              iconEl = <Check className="h-5 w-5 text-success" />;
            } else if (answer.id === selectedAnswer && !answer.isCorrect) {
              borderClass = "border-destructive";
              bgClass = "bg-destructive/10";
              iconEl = <X className="h-5 w-5 text-destructive" />;
            } else {
              borderClass = "border-border opacity-50";
            }
          } else if (answer.id === selectedAnswer) {
            borderClass = "border-primary";
            bgClass = "bg-primary/5";
          }

          return (
            <motion.button
              key={answer.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              disabled={hasValidated}
              onClick={() => setSelectedAnswer(answer.id)}
              className={`flex w-full items-center gap-3 rounded-lg border ${borderClass} ${bgClass} p-4 text-left transition-all duration-200`}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-secondary text-sm font-medium text-secondary-foreground">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="flex-1 text-foreground">{answer.text}</span>
              {iconEl}
            </motion.button>
          );
        })}
      </div>

      {/* Explanation */}
      <AnimatePresence>
        {hasValidated && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8 overflow-hidden"
          >
            <div className="rounded-lg border border-border bg-secondary/50 p-4">
              <p className="text-sm font-medium text-foreground mb-1">Explication</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {question.explanation}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actions */}
      <div className="flex justify-center">
        {!hasValidated ? (
          <Button
            onClick={handleValidate}
            disabled={!selectedAnswer}
            size="lg"
            className="rounded-full px-8"
          >
            Valider
          </Button>
        ) : (
          <Button
            onClick={handleNext}
            size="lg"
            className="rounded-full px-8"
          >
            {questionNumber === totalQuestions ? "Voir les résultats" : "Question suivante"}
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default QuizQuestion;
