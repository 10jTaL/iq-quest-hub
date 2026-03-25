import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart3, Users, TrendingUp } from "lucide-react";

interface Participation {
  email: string;
  score: number;
  total_questions: number;
  percentage: number;
  completed_at: string;
}

interface QuizStatsProps {
  quizSlug: string;
}

const QuizStats = ({ quizSlug }: QuizStatsProps) => {
  const [participations, setParticipations] = useState<Participation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/participations/${quizSlug}/all`)
      .then(r => r.json())
      .then(data => setParticipations(Array.isArray(data) ? data : []))
      .finally(() => setIsLoading(false));
  }, [quizSlug]);

  if (isLoading) return (
    <div className="flex justify-center py-8">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-primary" />
    </div>
  );

  if (participations.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-8 text-center">
        <Users className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
        <p className="text-muted-foreground">Aucune participation enregistrée pour ce quiz.</p>
      </div>
    );
  }

  const averageScore =
    participations.reduce((sum, p) => sum + p.percentage, 0) / participations.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Participants</p>
            <p className="font-heading text-2xl font-bold text-foreground">{participations.length}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
            <TrendingUp className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Score moyen</p>
            <p className="font-heading text-2xl font-bold text-foreground">{Math.round(averageScore)}%</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex items-center gap-2 border-b border-border px-5 py-4">
          <BarChart3 className="h-5 w-5 text-primary" />
          <h3 className="font-heading font-semibold text-foreground">Résultats des participants</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead className="text-center">Score</TableHead>
              <TableHead className="text-center">Total</TableHead>
              <TableHead className="text-center">Pourcentage</TableHead>
              <TableHead className="text-center">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {participations.map((p, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium text-foreground">{p.email}</TableCell>
                <TableCell className="text-center">{p.score}</TableCell>
                <TableCell className="text-center">{p.total_questions}</TableCell>
                <TableCell className="text-center">
                  <span className={p.percentage >= 70 ? "font-semibold text-primary" : p.percentage >= 40 ? "text-foreground" : "text-destructive"}>
                    {p.percentage}%
                  </span>
                </TableCell>
                <TableCell className="text-center text-muted-foreground text-xs">
                  {new Date(p.completed_at).toLocaleDateString('fr-FR')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
};

export default QuizStats;