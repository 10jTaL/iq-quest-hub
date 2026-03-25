import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import QuizCard from "@/components/QuizCard";
import { Settings, LogOut } from "lucide-react";
import { useOidc, useOidcAccessToken  } from '@axa-fr/react-oidc';
import { Button } from "@/components/ui/button";
import { QuizConfig } from "@/types/quiz";
import { useUser } from "@/contexts/UserContext";

const Index = () => {

  const { logout } = useOidc();
  const { role } = useUser();
  const isPrivileged = role === "administrateur" || role === "maitre_du_jeu";
  //console.log(logout);
  const [quizzes, setQuizzes] = useState<QuizConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { accessTokenPayload } = useOidcAccessToken();
  useEffect(() => {
    async function fetchQuizzes() {
      try {
        const response = await fetch("/api/quiz");
        if (!response.ok) throw new Error("Erreur API");
        const data: QuizConfig[] = await response.json();
        setQuizzes(data.filter(q => q.isActive && q.questions.some(question => question.isActive)));
      } catch (error) {
        console.error("Erreur chargement quiz", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchQuizzes();
  }, []);
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="font-heading text-lg font-bold text-foreground">
            QuizAI<span className="text-primary">.</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">{accessTokenPayload?.email}</span>
            {isPrivileged && (
            <Link
              to="/admin"
              className="flex items-center gap-2 rounded-full border border-border px-4 py-1.5 text-sm text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
            >
              <Settings className="h-3.5 w-3.5" />
              Administration
            </Link>
            )}
            <Button variant="ghost" size="icon" onClick={logout} className="h-9 w-9 text-muted-foreground hover:text-foreground">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
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
          {quizzes.map((quiz, i) => (
              <QuizCard key={quiz.id} quiz={quiz} index={i} />
            ))}
        </div>
      </section>
    </div>
  );
};

export default Index;
