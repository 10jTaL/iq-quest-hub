import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Quiz } from "@/types/quiz";

interface QuizCardProps {
  quiz: Quiz;
  index: number;
}

const iconColorMap: Record<string, string> = {
  blue: "bg-blue-50 text-blue-600",
  orange: "bg-orange-50 text-orange-600",
  red: "bg-red-50 text-red-600",
  green: "bg-emerald-50 text-emerald-600",
  purple: "bg-purple-50 text-purple-600",
  teal: "bg-teal-50 text-teal-600",
};

const QuizCard = ({ quiz, index }: QuizCardProps) => {
  const colorClass = iconColorMap[quiz.iconColor || "blue"] || iconColorMap.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <Link to={`/quiz/${quiz.slug}`} className="block group">
        <div className="relative rounded-xl border border-border bg-card p-6 transition-all duration-200 hover:shadow-lg hover:border-primary/30">
          <div className="flex items-start justify-between mb-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${colorClass}`}>
              {quiz.icon}
            </div>
            <span className="inline-flex items-center rounded-full border border-border bg-secondary px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
              {quiz.questionCount} questions
            </span>
          </div>
          <h3 className="mb-1.5 font-heading text-base font-semibold text-foreground group-hover:text-primary transition-colors">
            {quiz.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {quiz.description}
          </p>
        </div>
      </Link>
    </motion.div>
  );
};

export default QuizCard;
