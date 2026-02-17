import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Quiz } from "@/types/quiz";

interface QuizCardProps {
  quiz: Quiz;
  index: number;
}

const QuizCard = ({ quiz, index }: QuizCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link to={`/quiz/${quiz.slug}`} className="block group">
        <div className="relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-[var(--shadow-glow)]">
          <div className="absolute inset-0 bg-[var(--gradient-card)] opacity-60" />
          <div className="relative z-10">
            <div className="mb-4 text-4xl">{quiz.icon}</div>
            <h3 className="mb-2 font-heading text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
              {quiz.title}
            </h3>
            <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
              {quiz.description}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {quiz.questionCount} questions
              </span>
              <span className="text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                Commencer →
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default QuizCard;
