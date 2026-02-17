import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Clock, HelpCircle } from "lucide-react";

interface QuizIntroProps {
  title: string;
  introduction: string;
  questionCount: number;
  icon: string;
  onStart: () => void;
}

const QuizIntro = ({ title, introduction, questionCount, icon, onStart }: QuizIntroProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-xl text-center"
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-accent text-5xl"
      >
        {icon}
      </motion.div>

      <h1 className="mb-3 font-heading text-2xl font-bold text-foreground md:text-3xl">
        {title}
      </h1>

      <p className="mb-8 text-muted-foreground leading-relaxed">
        {introduction}
      </p>

      <div className="mb-8 inline-flex items-center gap-4 rounded-xl border border-border bg-card px-5 py-3 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <HelpCircle className="h-4 w-4" />
          {questionCount} questions
        </span>
        <span className="h-4 w-px bg-border" />
        <span className="flex items-center gap-1.5">
          <Clock className="h-4 w-4" />
          ~{Math.ceil(questionCount * 1.5)} min
        </span>
      </div>

      <div>
        <Button
          onClick={onStart}
          size="lg"
          className="rounded-full px-8 text-base font-semibold"
        >
          Démarrer le quiz
        </Button>
      </div>
    </motion.div>
  );
};

export default QuizIntro;
