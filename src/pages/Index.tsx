import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import QuizCard from "@/components/QuizCard";
import { mockQuizzes } from "@/data/mockQuizzes";
import { Settings } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="font-heading text-lg font-bold text-foreground">
            QuizAI<span className="text-primary">.</span>
          </Link>
          <Link
            to="/admin"
            className="flex items-center gap-2 rounded-full border border-border px-4 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
          >
            <Settings className="h-3.5 w-3.5" />
            Administration
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="container py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="mb-3 font-heading text-3xl font-bold text-foreground md:text-4xl">
            Testez vos connaissances
          </h1>
          <p className="mx-auto max-w-lg text-muted-foreground">
            Des quiz générés par intelligence artificielle pour évaluer et renforcer vos compétences professionnelles.
          </p>
        </motion.div>
      </section>

      {/* Quiz Grid */}
      <section className="container pb-20">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {mockQuizzes.map((quiz, i) => (
            <QuizCard key={quiz.id} quiz={quiz} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;
