import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { LogIn, AlertCircle } from "lucide-react";

const LoginPage = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("L'email est requis.");
      return;
    }

    const success = login(email.trim(), password);
    if (!success) {
      setError("Mot de passe incorrect.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background" style={{ background: "var(--gradient-hero)" }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        <div className="rounded-2xl border border-border bg-card p-8 shadow-lg" style={{ boxShadow: "var(--shadow-glow)" }}>
          {/* Logo */}
          <div className="mb-8 text-center">
            <h1 className="font-heading text-2xl font-bold text-foreground">
              QuizAI<span className="text-primary">.</span>
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Connectez-vous pour accéder aux quiz
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre@email.com"
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <Button type="submit" className="w-full gap-2 rounded-full" size="lg">
              <LogIn className="h-4 w-4" />
              Se connecter
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Mot de passe par défaut : <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">quizai</code>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
