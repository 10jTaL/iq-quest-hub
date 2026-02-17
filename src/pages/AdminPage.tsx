import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, Trash2, Save, Webhook, Key, FileText, Settings } from "lucide-react";
import { QuizConfig, ResultMessage } from "@/types/quiz";
import { toast } from "sonner";

const defaultResultMessages: ResultMessage[] = [
  { minScore: 0, maxScore: 40, title: "À renforcer", message: "Continuez à vous former." },
  { minScore: 41, maxScore: 70, title: "Bon niveau", message: "Vous avez de bonnes bases." },
  { minScore: 71, maxScore: 100, title: "Excellent", message: "Bravo, vous maîtrisez le sujet !" },
];

const AdminPage = () => {
  const [configs, setConfigs] = useState<QuizConfig[]>([]);
  const [editing, setEditing] = useState<QuizConfig | null>(null);

  const createNew = () => {
    const newConfig: QuizConfig = {
      id: Date.now().toString(),
      title: "",
      slug: "",
      description: "",
      introduction: "",
      icon: "📝",
      webhookUrl: "",
      apiKey: "",
      sourceDocument: "",
      questionCount: 10,
      maxApiRetries: 3,
      resultMessages: [...defaultResultMessages],
    };
    setEditing(newConfig);
  };

  const handleSave = () => {
    if (!editing) return;
    if (!editing.title || !editing.webhookUrl) {
      toast.error("Le titre et le webhook sont requis.");
      return;
    }
    const slug = editing.title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    const updated = { ...editing, slug };

    setConfigs((prev) => {
      const exists = prev.find((c) => c.id === updated.id);
      return exists ? prev.map((c) => (c.id === updated.id ? updated : c)) : [...prev, updated];
    });
    setEditing(null);
    toast.success("Quiz sauvegardé avec succès.");
  };

  const handleDelete = (id: string) => {
    setConfigs((prev) => prev.filter((c) => c.id !== id));
    toast.success("Quiz supprimé.");
  };

  const updateResultMessage = (index: number, field: keyof ResultMessage, value: string | number) => {
    if (!editing) return;
    const updated = [...editing.resultMessages];
    updated[index] = { ...updated[index], [field]: value };
    setEditing({ ...editing, resultMessages: updated });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Retour au site
          </Link>
          <span className="font-heading text-lg font-semibold text-foreground">
            Administration
          </span>
        </div>
      </header>

      <main className="container py-10">
        {!editing ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="mb-8 flex items-center justify-between">
              <h1 className="font-heading text-2xl font-bold text-foreground">Mes Quiz</h1>
              <Button onClick={createNew} className="gap-2 rounded-full">
                <Plus className="h-4 w-4" />
                Nouveau quiz
              </Button>
            </div>

            {configs.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border p-16 text-center">
                <Settings className="mx-auto mb-4 h-12 w-12 text-muted-foreground/40" />
                <p className="text-muted-foreground">Aucun quiz configuré. Créez votre premier quiz pour commencer.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {configs.map((config) => (
                  <div
                    key={config.id}
                    className="flex items-center justify-between rounded-lg border border-border bg-card p-4"
                  >
                    <div>
                      <h3 className="font-heading font-semibold text-foreground">
                        {config.icon} {config.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{config.questionCount} questions • {config.webhookUrl ? "Webhook configuré" : "Webhook manquant"}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setEditing(config)}>
                        Modifier
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(config.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-2xl">
            <div className="mb-8 flex items-center justify-between">
              <h1 className="font-heading text-2xl font-bold text-foreground">
                {editing.title || "Nouveau quiz"}
              </h1>
              <Button variant="outline" onClick={() => setEditing(null)}>Annuler</Button>
            </div>

            <div className="space-y-8">
              {/* General */}
              <section className="rounded-xl border border-border bg-card p-6 space-y-4">
                <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-foreground">
                  <FileText className="h-5 w-5 text-primary" />
                  Informations générales
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label>Titre du quiz</Label>
                    <Input
                      value={editing.title}
                      onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                      placeholder="Ex: Cybersécurité avancée"
                    />
                  </div>
                  <div>
                    <Label>Icône (emoji)</Label>
                    <Input
                      value={editing.icon}
                      onChange={(e) => setEditing({ ...editing, icon: e.target.value })}
                      placeholder="🛡️"
                    />
                  </div>
                </div>
                <div>
                  <Label>Description courte</Label>
                  <Input
                    value={editing.description}
                    onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                    placeholder="Une description pour la carte d'accueil"
                  />
                </div>
                <div>
                  <Label>Texte d'introduction</Label>
                  <Textarea
                    value={editing.introduction}
                    onChange={(e) => setEditing({ ...editing, introduction: e.target.value })}
                    placeholder="Texte affiché avant de commencer le quiz"
                    rows={3}
                  />
                </div>
              </section>

              {/* API / n8n */}
              <section className="rounded-xl border border-border bg-card p-6 space-y-4">
                <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-foreground">
                  <Webhook className="h-5 w-5 text-primary" />
                  Configuration n8n / Agent IA
                </h2>
                <div>
                  <Label>URL du Webhook n8n</Label>
                  <Input
                    value={editing.webhookUrl}
                    onChange={(e) => setEditing({ ...editing, webhookUrl: e.target.value })}
                    placeholder="https://votre-instance.n8n.cloud/webhook/..."
                  />
                </div>
                <div>
                  <Label>Clé API (optionnel)</Label>
                  <Input
                    value={editing.apiKey}
                    onChange={(e) => setEditing({ ...editing, apiKey: e.target.value })}
                    placeholder="Bearer token ou clé d'authentification"
                    type="password"
                  />
                </div>
                <div>
                  <Label>Document source / Base de connaissance</Label>
                  <Textarea
                    value={editing.sourceDocument}
                    onChange={(e) => setEditing({ ...editing, sourceDocument: e.target.value })}
                    placeholder="URL du document ou texte de référence envoyé à l'agent IA"
                    rows={3}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label>Nombre de questions</Label>
                    <Input
                      type="number"
                      min={1}
                      max={50}
                      value={editing.questionCount}
                      onChange={(e) => setEditing({ ...editing, questionCount: parseInt(e.target.value) || 10 })}
                    />
                  </div>
                  <div>
                    <Label>Tentatives max (appels API)</Label>
                    <Input
                      type="number"
                      min={1}
                      max={10}
                      value={editing.maxApiRetries}
                      onChange={(e) => setEditing({ ...editing, maxApiRetries: parseInt(e.target.value) || 3 })}
                    />
                  </div>
                </div>
              </section>

              {/* Result messages */}
              <section className="rounded-xl border border-border bg-card p-6 space-y-4">
                <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-foreground">
                  <Key className="h-5 w-5 text-primary" />
                  Messages de résultats
                </h2>
                {editing.resultMessages.map((rm, i) => (
                  <div key={i} className="rounded-lg border border-border bg-secondary/30 p-4 space-y-3">
                    <div className="grid gap-3 sm:grid-cols-3">
                      <div>
                        <Label>Score min (%)</Label>
                        <Input
                          type="number"
                          min={0}
                          max={100}
                          value={rm.minScore}
                          onChange={(e) => updateResultMessage(i, "minScore", parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <Label>Score max (%)</Label>
                        <Input
                          type="number"
                          min={0}
                          max={100}
                          value={rm.maxScore}
                          onChange={(e) => updateResultMessage(i, "maxScore", parseInt(e.target.value) || 100)}
                        />
                      </div>
                      <div>
                        <Label>Titre</Label>
                        <Input
                          value={rm.title}
                          onChange={(e) => updateResultMessage(i, "title", e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Message</Label>
                      <Textarea
                        value={rm.message}
                        onChange={(e) => updateResultMessage(i, "message", e.target.value)}
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
              </section>

              <Button onClick={handleSave} size="lg" className="w-full gap-2 rounded-full">
                <Save className="h-4 w-4" />
                Sauvegarder le quiz
              </Button>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default AdminPage;
