import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import QuizCard from "@/components/QuizCard";
import { mockQuizzes } from "@/data/mockQuizzes";

const Index = () => {
  return (
    <div className="min-h-screen" style={{ background: "var(--gradient-hero)" }}>
      {/* Header */}
      <header className="border-b border-border">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="font-heading text-xl font-bold text-foreground">
            QuizAI<span className="text-primary">.</span>
          </Link>
          <Link
            to="/admin"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Administration
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="container py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="mb-4 font-heading text-4xl font-bold text-foreground md:text-5xl lg:text-6xl">
            Testez vos<br />
            <span className="text-primary">connaissances</span>
          </h1>
          <p className="mx-auto max-w-xl text-lg text-muted-foreground">
            Des quiz générés par intelligence artificielle pour évaluer et renforcer vos compétences professionnelles.
          </p>
        </motion.div>
      </section>

      {/* Quiz Grid */}
      <section className="container pb-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mockQuizzes.map((quiz, i) => (
            <QuizCard key={quiz.id} quiz={quiz} index={i} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;
