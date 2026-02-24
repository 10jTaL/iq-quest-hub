import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Plus, Trash2, Save, Webhook, Key, FileText, Settings, BookOpen, Shield, Users, Crown, Eye, EyeOff } from "lucide-react";
import { QuizConfig, SiteConfig, ResultMessage, RoleUser, UserRole } from "@/types/quiz";
import { useAuth } from "@/contexts/AuthContext";
import QuizQuestionViewer from "@/components/admin/QuizQuestionViewer";
import { toast } from "sonner";

const defaultResultMessages: ResultMessage[] = [
  { minScore: 0, maxScore: 40, title: "À renforcer", message: "Continuez à vous former." },
  { minScore: 41, maxScore: 70, title: "Bon niveau", message: "Vous avez de bonnes bases." },
  { minScore: 71, maxScore: 100, title: "Excellent", message: "Bravo, vous maîtrisez le sujet !" },
];

const AdminPage = () => {
  const { user } = useAuth();
  const [configs, setConfigs] = useState<QuizConfig[]>([]);
  const [editing, setEditing] = useState<QuizConfig | null>(null);
  const [viewingQuestions, setViewingQuestions] = useState<string | null>(null);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(() => {
    try {
      const stored = localStorage.getItem("siteConfig");
      if (stored) return JSON.parse(stored);
    } catch {}
    return { webhookUrl: "", apiKey: "", maxApiRetries: 3, roleUsers: [] };
  });
  const [newRoleEmail, setNewRoleEmail] = useState("");
  const [newRoleName, setNewRoleName] = useState("");
  const [newRole, setNewRole] = useState<UserRole>("maitre_du_jeu");

  const myQuizzes = configs.filter(
    (c) => c.createdBy === user?.email || user?.role === "administrateur"
  );

  const createNew = () => {
    const newConfig: QuizConfig = {
      id: Date.now().toString(),
      title: "",
      slug: "",
      description: "",
      introduction: "",
      icon: "📝",
      sourceDocument: "",
      questionCount: 10,
      resultMessages: [...defaultResultMessages],
      isActive: true,
      createdBy: user?.email || "",
      questions: [],
    };
    setEditing(newConfig);
  };

  const handleSave = () => {
    if (!editing) return;
    if (!editing.title) {
      toast.error("Le titre est requis.");
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

  const toggleQuizActive = (id: string) => {
    setConfigs((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
    toast.success("Statut du quiz mis à jour.");
  };

  const handleUpdateQuizQuestions = (updated: QuizConfig) => {
    setConfigs((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  const handleSaveSiteConfig = () => {
    if (!siteConfig.webhookUrl) {
      toast.error("L'URL du webhook est requise.");
      return;
    }
    localStorage.setItem("siteConfig", JSON.stringify(siteConfig));
    toast.success("Paramètres du site sauvegardés.");
  };

  const updateResultMessage = (index: number, field: keyof ResultMessage, value: string | number) => {
    if (!editing) return;
    const updated = [...editing.resultMessages];
    updated[index] = { ...updated[index], [field]: value };
    setEditing({ ...editing, resultMessages: updated });
  };

  const addRoleUser = () => {
    if (!newRoleEmail || !newRoleName) {
      toast.error("L'email et le nom sont requis.");
      return;
    }
    const newUser: RoleUser = {
      id: Date.now().toString(),
      email: newRoleEmail,
      name: newRoleName,
      role: newRole,
    };
    setSiteConfig((prev) => ({
      ...prev,
      roleUsers: [...prev.roleUsers, newUser],
    }));
    setNewRoleEmail("");
    setNewRoleName("");
    setNewRole("maitre_du_jeu");
    toast.success("Utilisateur ajouté.");
  };

  const removeRoleUser = (id: string) => {
    setSiteConfig((prev) => ({
      ...prev,
      roleUsers: prev.roleUsers.filter((u) => u.id !== id),
    }));
    toast.success("Utilisateur supprimé.");
  };

  const updateRoleUser = (id: string, role: UserRole) => {
    setSiteConfig((prev) => ({
      ...prev,
      roleUsers: prev.roleUsers.map((u) => (u.id === id ? { ...u, role } : u)),
    }));
  };

  const roleLabels: Record<UserRole, { label: string; icon: React.ReactNode; color: string }> = {
    administrateur: { label: "Administrateur", icon: <Crown className="h-4 w-4" />, color: "text-destructive" },
    maitre_du_jeu: { label: "Maître du jeu", icon: <Shield className="h-4 w-4" />, color: "text-primary" },
    user: { label: "Utilisateur", icon: <Users className="h-4 w-4" />, color: "text-muted-foreground" },
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
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
        {editing ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-2xl">
            <div className="mb-8 flex items-center justify-between">
              <h1 className="font-heading text-2xl font-bold text-foreground">
                {editing.title || "Nouveau quiz"}
              </h1>
              <Button variant="outline" onClick={() => setEditing(null)}>Annuler</Button>
            </div>

            <div className="space-y-8">
              {/* Informations générales */}
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
                <div className="flex items-center gap-3">
                  <Switch
                    checked={editing.isActive}
                    onCheckedChange={(checked) => setEditing({ ...editing, isActive: checked })}
                  />
                  <Label className="cursor-pointer">
                    {editing.isActive ? "Quiz actif" : "Quiz désactivé"}
                  </Label>
                </div>
              </section>

              {/* Paramétrage du quiz */}
              <section className="rounded-xl border border-border bg-card p-6 space-y-4">
                <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-foreground">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Paramétrage du quiz
                </h2>
                <div>
                  <Label>Document source / Base de connaissance</Label>
                  <Textarea
                    value={editing.sourceDocument}
                    onChange={(e) => setEditing({ ...editing, sourceDocument: e.target.value })}
                    placeholder="URL du document ou texte de référence envoyé à l'agent IA"
                    rows={3}
                  />
                </div>
                <div className="max-w-xs">
                  <Label>Nombre de questions</Label>
                  <Input
                    type="number"
                    min={1}
                    max={50}
                    value={editing.questionCount}
                    onChange={(e) => setEditing({ ...editing, questionCount: parseInt(e.target.value) || 10 })}
                  />
                </div>
              </section>

              {/* Questions existantes */}
              {editing.questions.length > 0 && (
                <section className="rounded-xl border border-border bg-card p-6 space-y-4">
                  <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-foreground">
                    <Eye className="h-5 w-5 text-primary" />
                    Questions ({editing.questions.filter((q) => q.isActive).length} actives / {editing.questions.length} total)
                  </h2>
                  <QuizQuestionViewer
                    config={editing}
                    onUpdate={(updated) => setEditing(updated)}
                  />
                </section>
              )}

              {/* Messages de résultats */}
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
                          type="number" min={0} max={100}
                          value={rm.minScore}
                          onChange={(e) => updateResultMessage(i, "minScore", parseInt(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <Label>Score max (%)</Label>
                        <Input
                          type="number" min={0} max={100}
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
        ) : (
          <Tabs defaultValue="quizzes" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="quizzes" className="gap-2">
                <FileText className="h-4 w-4" />
                Création de quiz
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-2">
                <Settings className="h-4 w-4" />
                Paramètres du site
              </TabsTrigger>
            </TabsList>

            {/* === Onglet Création de quiz === */}
            <TabsContent value="quizzes">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="mb-8 flex items-center justify-between">
                  <div>
                    <h1 className="font-heading text-2xl font-bold text-foreground">Mes Quiz</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                      {user?.role === "administrateur"
                        ? "Tous les quiz (vue administrateur)"
                        : `Quiz créés par ${user?.email}`}
                    </p>
                  </div>
                  <Button onClick={createNew} className="gap-2 rounded-full">
                    <Plus className="h-4 w-4" />
                    Nouveau quiz
                  </Button>
                </div>

                {myQuizzes.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-border p-16 text-center">
                    <FileText className="mx-auto mb-4 h-12 w-12 text-muted-foreground/40" />
                    <p className="text-muted-foreground">Aucun quiz configuré. Créez votre premier quiz pour commencer.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {myQuizzes.map((config) => (
                      <div key={config.id}>
                        <div
                          className={`flex items-center justify-between rounded-lg border bg-card p-4 transition-colors ${
                            config.isActive ? "border-border" : "border-border/50 opacity-60"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Switch
                              checked={config.isActive}
                              onCheckedChange={() => toggleQuizActive(config.id)}
                              aria-label="Activer/désactiver le quiz"
                            />
                            <div>
                              <h3 className="font-heading font-semibold text-foreground flex items-center gap-2">
                                {config.icon} {config.title}
                                {!config.isActive && (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                                    <EyeOff className="h-3 w-3" />
                                    Désactivé
                                  </span>
                                )}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {config.questionCount} questions · créé par {config.createdBy}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                setViewingQuestions(viewingQuestions === config.id ? null : config.id)
                              }
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Questions
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => setEditing(config)}>
                              Modifier
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDelete(config.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>

                        {/* Questions viewer inline */}
                        {viewingQuestions === config.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="mt-2 rounded-lg border border-border bg-secondary/20 p-4"
                          >
                            <QuizQuestionViewer
                              config={config}
                              onUpdate={handleUpdateQuizQuestions}
                            />
                          </motion.div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            </TabsContent>

            {/* === Onglet Paramètres du site === */}
            <TabsContent value="settings">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mx-auto max-w-2xl">
                <h1 className="font-heading text-2xl font-bold text-foreground mb-8">Paramètres du site</h1>

                <div className="space-y-8">
                  <section className="rounded-xl border border-border bg-card p-6 space-y-4">
                    <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-foreground">
                      <Webhook className="h-5 w-5 text-primary" />
                      Configuration n8n / Agent IA
                    </h2>
                    <div>
                      <Label>URL du Webhook n8n</Label>
                      <Input
                        value={siteConfig.webhookUrl}
                        onChange={(e) => setSiteConfig({ ...siteConfig, webhookUrl: e.target.value })}
                        placeholder="https://votre-instance.n8n.cloud/webhook/..."
                      />
                    </div>
                    <div>
                      <Label>Clé API (optionnel)</Label>
                      <Input
                        value={siteConfig.apiKey}
                        onChange={(e) => setSiteConfig({ ...siteConfig, apiKey: e.target.value })}
                        placeholder="Bearer token ou clé d'authentification"
                        type="password"
                      />
                    </div>
                    <div className="max-w-xs">
                      <Label>Tentatives max (appels API)</Label>
                      <Input
                        type="number" min={1} max={10}
                        value={siteConfig.maxApiRetries}
                        onChange={(e) => setSiteConfig({ ...siteConfig, maxApiRetries: parseInt(e.target.value) || 3 })}
                      />
                    </div>
                  </section>

                  {/* Gestion des rôles */}
                  <section className="rounded-xl border border-border bg-card p-6 space-y-4">
                    <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-foreground">
                      <Shield className="h-5 w-5 text-primary" />
                      Gestion des rôles
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Par défaut, chaque personne est un <strong>Utilisateur</strong>. Ajoutez des rôles spécifiques ci-dessous.
                    </p>

                    <div className="space-y-2">
                      {siteConfig.roleUsers.length === 0 ? (
                        <div className="rounded-lg border border-dashed border-border p-6 text-center">
                          <Users className="mx-auto mb-2 h-8 w-8 text-muted-foreground/40" />
                          <p className="text-sm text-muted-foreground">Aucun rôle spécifique attribué.</p>
                        </div>
                      ) : (
                        siteConfig.roleUsers.map((u) => (
                          <div
                            key={u.id}
                            className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-3"
                          >
                            <div className="flex items-center gap-3">
                              <span className={roleLabels[u.role].color}>
                                {roleLabels[u.role].icon}
                              </span>
                              <div>
                                <p className="text-sm font-medium text-foreground">{u.name}</p>
                                <p className="text-xs text-muted-foreground">{u.email}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <select
                                value={u.role}
                                onChange={(e) => updateRoleUser(u.id, e.target.value as UserRole)}
                                className="rounded-md border border-input bg-background px-2 py-1 text-sm"
                              >
                                <option value="administrateur">Administrateur</option>
                                <option value="maitre_du_jeu">Maître du jeu</option>
                                <option value="user">Utilisateur</option>
                              </select>
                              <Button variant="outline" size="sm" onClick={() => removeRoleUser(u.id)}>
                                <Trash2 className="h-3 w-3 text-destructive" />
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Ajouter un rôle */}
                    <div className="rounded-lg border border-border bg-secondary/20 p-4 space-y-3">
                      <h3 className="text-sm font-semibold text-foreground">Ajouter un utilisateur</h3>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <Label>Nom</Label>
                          <Input
                            value={newRoleName}
                            onChange={(e) => setNewRoleName(e.target.value)}
                            placeholder="Jean Dupont"
                          />
                        </div>
                        <div>
                          <Label>Email</Label>
                          <Input
                            value={newRoleEmail}
                            onChange={(e) => setNewRoleEmail(e.target.value)}
                            placeholder="jean@exemple.com"
                          />
                        </div>
                      </div>
                      <div className="flex items-end gap-3">
                        <div className="flex-1">
                          <Label>Rôle</Label>
                          <select
                            value={newRole}
                            onChange={(e) => setNewRole(e.target.value as UserRole)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          >
                            <option value="administrateur">Administrateur</option>
                            <option value="maitre_du_jeu">Maître du jeu</option>
                          </select>
                        </div>
                        <Button onClick={addRoleUser} className="gap-2">
                          <Plus className="h-4 w-4" />
                          Ajouter
                        </Button>
                      </div>
                    </div>

                    {/* Légende des rôles */}
                    <div className="rounded-lg bg-accent/50 p-4 space-y-2">
                      <h3 className="text-sm font-semibold text-foreground">Descriptif des rôles</h3>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <p className="flex items-center gap-2">
                          <Crown className="h-3.5 w-3.5 text-destructive" />
                          <strong>Administrateur :</strong> Accès complet à tout le site
                        </p>
                        <p className="flex items-center gap-2">
                          <Shield className="h-3.5 w-3.5 text-primary" />
                          <strong>Maître du jeu :</strong> Création de quiz et gestion des questions
                        </p>
                        <p className="flex items-center gap-2">
                          <Users className="h-3.5 w-3.5 text-muted-foreground" />
                          <strong>Utilisateur :</strong> Rôle par défaut, accès aux quiz uniquement
                        </p>
                      </div>
                    </div>
                  </section>

                  <Button onClick={handleSaveSiteConfig} size="lg" className="w-full gap-2 rounded-full">
                    <Save className="h-4 w-4" />
                    Sauvegarder les paramètres
                  </Button>
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
  );
};

export default AdminPage;
