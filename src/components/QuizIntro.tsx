import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

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
      className="mx-auto max-w-2xl text-center"
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="mb-6 text-6xl"
      >
        {icon}
      </motion.div>

      <h1 className="mb-4 font-heading text-3xl font-bold text-foreground md:text-4xl">
        {title}
      </h1>

      <p className="mb-8 text-muted-foreground leading-relaxed text-lg">
        {introduction}
      </p>

      <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-2 text-sm text-secondary-foreground">
        <span>{questionCount} questions</span>
        <span className="text-muted-foreground">•</span>
        <span>~{Math.ceil(questionCount * 1.5)} min</span>
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
