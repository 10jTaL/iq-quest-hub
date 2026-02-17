import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ResultMessage } from "@/types/quiz";
import { RotateCcw, Home } from "lucide-react";

interface QuizResultsProps {
  score: number;
  totalQuestions: number;
  resultMessages: ResultMessage[];
  onRestart: () => void;
}

const QuizResults = ({ score, totalQuestions, resultMessages, onRestart }: QuizResultsProps) => {
  const percentage = Math.round((score / totalQuestions) * 100);
  const resultMessage = resultMessages.find(
    (rm) => percentage >= rm.minScore && percentage <= rm.maxScore
  ) || resultMessages[resultMessages.length - 1];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-lg text-center"
    >
      {/* Score circle */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
        className="mx-auto mb-8 flex h-36 w-36 items-center justify-center rounded-full border-4 border-primary animate-pulse-glow"
      >
        <div>
          <div className="font-heading text-4xl font-bold text-primary">{percentage}%</div>
          <div className="text-xs text-muted-foreground">{score}/{totalQuestions}</div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="mb-3 font-heading text-2xl font-bold text-foreground">
          {resultMessage.title}
        </h2>
        <p className="mb-10 text-muted-foreground leading-relaxed">
          {resultMessage.message}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex flex-col gap-3 sm:flex-row sm:justify-center"
      >
        <Button onClick={onRestart} variant="outline" className="rounded-full gap-2">
          <RotateCcw className="h-4 w-4" />
          Recommencer
        </Button>
        <Button asChild className="rounded-full gap-2">
          <Link to="/">
            <Home className="h-4 w-4" />
            Tous les quiz
          </Link>
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default QuizResults;
