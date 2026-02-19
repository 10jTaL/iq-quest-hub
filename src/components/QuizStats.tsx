import { motion } from "framer-motion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { mockParticipations, QuizParticipation } from "@/data/mockParticipations";
import { BarChart3, Users, TrendingUp } from "lucide-react";

interface QuizStatsProps {
  quizSlug: string;
}

const QuizStats = ({ quizSlug }: QuizStatsProps) => {
  const participations = mockParticipations.filter((p) => p.quizSlug === quizSlug);

  if (participations.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-8 text-center">
        <Users className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
        <p className="text-muted-foreground">Aucune participation enregistrée pour ce quiz.</p>
      </div>
    );
  }

  const averageScore =
    participations.reduce((sum, p) => sum + (p.correctAnswers / p.totalQuestions) * 100, 0) /
    participations.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      {/* Summary cards */}
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

      {/* Participants table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="flex items-center gap-2 border-b border-border px-5 py-4">
          <BarChart3 className="h-5 w-5 text-primary" />
          <h3 className="font-heading font-semibold text-foreground">Résultats des participants</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead className="text-center">Bonnes réponses</TableHead>
              <TableHead className="text-center">Total questions</TableHead>
              <TableHead className="text-center">Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {participations.map((p) => {
              const pct = Math.round((p.correctAnswers / p.totalQuestions) * 100);
              return (
                <TableRow key={p.id}>
                  <TableCell className="font-medium text-foreground">{p.userName}</TableCell>
                  <TableCell className="text-center">{p.correctAnswers}</TableCell>
                  <TableCell className="text-center">{p.totalQuestions}</TableCell>
                  <TableCell className="text-center">
                    <span
                      className={
                        pct >= 70
                          ? "font-semibold text-primary"
                          : pct >= 40
                          ? "text-foreground"
                          : "text-destructive"
                      }
                    >
                      {pct}%
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
};

export default QuizStats;
