import { QuizConfig, QuizQuestion } from "@/types/quiz";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Trash2, ChevronDown, ChevronUp, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface QuizQuestionViewerProps {
  config: QuizConfig;
  onUpdate: (updated: QuizConfig) => void;
}

const QuizQuestionViewer = ({ config, onUpdate }: QuizQuestionViewerProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleQuestionActive = (questionId: string) => {
    const updated = {
      ...config,
      questions: config.questions.map((q) =>
        q.id === questionId ? { ...q, isActive: !q.isActive } : q
      ),
    };
    onUpdate(updated);
    toast.success("Question mise à jour.");
  };

  const deleteQuestion = (questionId: string) => {
    const updated = {
      ...config,
      questions: config.questions.filter((q) => q.id !== questionId),
      questionCount: config.questions.filter((q) => q.id !== questionId).length,
    };
    onUpdate(updated);
    toast.success("Question supprimée.");
  };

  if (config.questions.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Aucune question pour ce quiz. Les questions seront générées par l'agent IA.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {config.questions.map((q, index) => (
        <div
          key={q.id}
          className={`rounded-lg border bg-card transition-colors ${
            q.isActive ? "border-border" : "border-border/50 opacity-60"
          }`}
        >
          {/* Question header */}
          <div className="flex items-center gap-3 p-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
              {index + 1}
            </span>
            <button
              onClick={() => setExpandedId(expandedId === q.id ? null : q.id)}
              className="flex-1 text-left text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              {q.question}
            </button>
            <div className="flex items-center gap-2 shrink-0">
              <Switch
                checked={q.isActive}
                onCheckedChange={() => toggleQuestionActive(q.id)}
                aria-label="Activer/désactiver la question"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteQuestion(q.id)}
                className="h-8 w-8 p-0"
              >
                <Trash2 className="h-3.5 w-3.5 text-destructive" />
              </Button>
              {expandedId === q.id ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </div>

          {/* Expanded answers */}
          {expandedId === q.id && (
            <div className="border-t border-border px-3 pb-3 pt-2 space-y-2">
              {q.answers.map((a) => (
                <div
                  key={a.id}
                  className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm ${
                    a.isCorrect
                      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                      : "bg-secondary/50 text-muted-foreground"
                  }`}
                >
                  {a.isCorrect ? (
                    <CheckCircle className="h-4 w-4 shrink-0" />
                  ) : (
                    <XCircle className="h-4 w-4 shrink-0" />
                  )}
                  {a.text}
                </div>
              ))}
              {q.explanation && (
                <p className="mt-2 rounded-md bg-accent/50 px-3 py-2 text-xs text-muted-foreground italic">
                  💡 {q.explanation}
                </p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default QuizQuestionViewer;
