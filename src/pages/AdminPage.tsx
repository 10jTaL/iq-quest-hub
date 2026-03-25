import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Plus, Trash2, Save, Webhook, Key, FileText, Settings, BookOpen, Shield, Users, Crown, Eye, EyeOff, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import { QuizConfig, SiteConfig, ResultMessage, RoleUser, UserRole } from "@/types/quiz";
import { useOidc, useOidcAccessToken } from '@axa-fr/react-oidc';
import QuizQuestionViewer from "@/components/admin/QuizQuestionViewer";
import { toast } from "sonner";
import { useUser } from "@/contexts/UserContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const defaultResultMessages: ResultMessage[] = [
  { minScore: 0, maxScore: 40, title: "À renforcer", message: "Continuez à vous former." },
  { minScore: 41, maxScore: 70, title: "Bon niveau", message: "Vous avez de bonnes bases." },
  { minScore: 71, maxScore: 100, title: "Excellent", message: "Bravo, vous maîtrisez le sujet !" },
];


const AdminPage = () => {
  const { logout } = useOidc();
  const { accessTokenPayload } = useOidcAccessToken();
  const [configs, setConfigs] = useState<QuizConfig[]>([]);
  const [editing, setEditing] = useState<QuizConfig | null>(null);
  const [viewingQuestions, setViewingQuestions] = useState<string | null>(null);
  const [showQuestions, setShowQuestions] = useState(false);
  const [showRegenDialog, setShowRegenDialog] = useState(false);
  const [regenErrors, setRegenErrors] = useState<{ title?: boolean; sourceDocument?: boolean; questionCount?: boolean }>({});
  const { role } = useUser();
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

  const groups = accessTokenPayload?.groups          // Keycloak, Azure AD
           ?? accessTokenPayload?.roles            // Keycloak roles
           ?? accessTokenPayload?.["cognito:groups"] // AWS Cognito
           ?? [];
  console.log(groups);
  console.log(accessTokenPayload);
  const myQuizzes = configs.filter(
    (c) => c.createdBy === accessTokenPayload?.email || role === "administrateur"
  );
  //begin mdu 26/02/2026
  const [isLoading, setIsLoading] = useState(false);
  //end mdu 26/02/2026

  const loadingMessages = [
    "📄 L'IA lit le document...",
    "🔎 L'IA analyse la structure du contenu...",
    "🧠 L'IA identifie les concepts clés...",
    "💡 L'IA réfléchit aux meilleures questions...",
    "✍️ L'IA rédige les questions...",
    "🎯 L'IA formule les réponses...",
    "🪤 L'IA prépare les réponses pièges...",
    "🔍 L'IA vérifie la cohérence des réponses...",
    "📊 L'IA équilibre la difficulté du quiz...",
    "⚙️ L'IA finalise le quiz...",
    "🏁 Presque terminé...",
  ];

  useEffect(() => {
    if (!isLoading) return;
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % loadingMessages.length;
      setLoadingMessage(loadingMessages[i]);
    }, 5500);
    return () => clearInterval(interval);
  }, [isLoading]);

  const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);

  //begin mdu 23/02/2026
  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch("/api/users");
        if (!response.ok) {
          throw new Error("Erreur API");
        }
        const users: RoleUser[] = await response.json();

        setSiteConfig((prev) => ({
          ...prev,
          roleUsers: users,
        }));
      } catch (error) {
        console.error("Erreur lors du chargement des users", error);
        toast.error("Impossible de charger les utilisateurs.");
      }
    }

    fetchUsers();
  }, []);

  useEffect(() => {
    async function fetchConfig() {
      try {
        const response = await fetch("/api/config");
        if (!response.ok) {
          throw new Error("Erreur API");
        }
        const configFromApi = (await response.json()) as Partial<SiteConfig>;
        setSiteConfig((prev) => ({
        webhookUrl: configFromApi[0].webhook_url ?? prev.webhook_url ?? "",
        apiKey: configFromApi[0].api_key ?? prev.api_key ?? "",
        maxApiRetries: configFromApi[0].max_api_retries ?? prev.max_api_retries ?? 3,
        roleUsers: configFromApi.roleUsers ?? prev.roleUsers ?? [],
      }));
      } catch (error) {
        console.error("Erreur lors du chargement des users", error);
        toast.error("Impossible de charger les utilisateurs.");
      }
    }

    fetchConfig();
  }, []);

  useEffect(() => {
  async function fetchQuizzes() {
    try {
        const response = await fetch("/api/quiz");
        if (!response.ok) throw new Error("Erreur API");
        const quizzes: QuizConfig[] = await response.json();
        setConfigs(quizzes);
      } catch (error) {
        console.error("Erreur lors du chargement des quiz", error);
        toast.error("Impossible de charger les quiz.");
      }
    }
    fetchQuizzes();
  }, []); // ← [] = une seule fois au montage du composant
  //end mdu 23/02/2026

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
      createdBy: accessTokenPayload?.email || "",
      questions: [],
    };
    setEditing(newConfig);
  };

  const handleSave = async () => {
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

    try {
      // ✅ Appel backend pour sauvegarder en BDD
      const response = await fetch(
        updated.id && configs.find(c => c.id === updated.id)
          ? `/api/quiz/${updated.id}`  // ✅ PUT avec l'id dans l'URL
          : `/api/quiz`,               // ✅ POST sans id
        {
          method: updated.id && configs.find(c => c.id === updated.id) ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updated),
        }
      );

      if (!response.ok) throw new Error("Erreur lors de la sauvegarde");

      const saved = await response.json();

      // ✅ Met à jour le state local avec ce que la BDD a retourné
      setConfigs(prev => {
        const exists = prev.find(c => c.id === saved.id);
        return exists
          ? prev.map(c => c.id === saved.id ? saved : c)
          : [...prev, saved];
      });
      if(!(updated.id && configs.find(c => c.id === updated.id)))
      {
        window.location.reload();
      }
      setEditing(null);
      toast.success("Quiz sauvegardé avec succès.");
    } catch (error) {
      toast.error("Erreur lors de la sauvegarde du quiz.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/quiz/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Erreur suppression");
      setConfigs(prev => prev.filter(c => c.id !== id));
      toast.success("Quiz supprimé.");
    } catch (error) {
      toast.error("Erreur lors de la suppression du quiz.");
    }
  };

  const toggleQuizActive = async (id: string) => {
    const quiz = configs.find(c => c.id === id);
    if (!quiz) return;

    const newValue = !quiz.isActive;

    try {
      const response = await fetch(`/api/quiz/${id}/active`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: newValue }),
      });
      if (!response.ok) throw new Error("Erreur toggle quiz");

      // ✅ Met à jour le state local
      setConfigs(prev => prev.map(c => c.id === id ? { ...c, isActive: newValue } : c));
      toast.success("Statut du quiz mis à jour.");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du statut.");
    }
  };

  const toggleQuestionActive = async (quizId: string, questionId: string) => {
    const quiz = configs.find(c => c.id === quizId);
    if (!quiz) return;

    const question = quiz.questions.find(q => q.id === questionId);
    if (!question) return;

    const newValue = !question.isActive;

    try {
      const response = await fetch(`/api/question/${questionId}/active`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: newValue }),
      });
      if (!response.ok) throw new Error("Erreur toggle question");

      // ✅ Met à jour uniquement la question dans le bon quiz
      setConfigs(prev => prev.map(c =>
        c.id === quizId
          ? {
              ...c,
              questions: c.questions.map(q =>
                q.id === questionId ? { ...q, isActive: newValue } : q
              )
            }
          : c
      ));
      toast.success("Statut de la question mis à jour.");
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du statut.");
    }
  };

  const deleteQuestion = async (quizId: string, questionId: string) => {
    try {
      const response = await fetch(`/api/question/${questionId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Erreur suppression question");

      setConfigs(prev => prev.map(c =>
        c.id === quizId
          ? { ...c, questions: c.questions.filter(q => q.id !== questionId) }
          : c
      ));
      toast.success("Question supprimée.");
    } catch (error) {
      toast.error("Erreur lors de la suppression de la question.");
    }
  };

  const handleUpdateQuizQuestions = (updated: QuizConfig) => {
    setConfigs((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  const handleSaveSiteConfig = async () => {
    if (!siteConfig.webhookUrl) {
      toast.error("L'URL du webhook est requise.");
      return;
    }
    //begin mdu 23/02/2026
    await updateConfig(siteConfig);
    //localStorage.setItem("siteConfig", JSON.stringify(siteConfig));
    //end mdu 23/02/2026
    toast.success("Paramètres du site sauvegardés.");
  };

  const updateResultMessage = (index: number, field: keyof ResultMessage, value: string | number) => {
    if (!editing) return;
    const updated = [...editing.resultMessages];
    updated[index] = { ...updated[index], [field]: value };
    setEditing({ ...editing, resultMessages: updated });
  };

  const addRoleUser = async () => {
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
    //begin mdu 23/02/2026
    try {
      await addUser(newUser);

      setSiteConfig((prev) => ({
        ...prev,
        roleUsers: [...prev.roleUsers, newUser],
      }));

      toast.success("Utilisateur ajouté.");
    } catch (error) {
      toast.error("Erreur lors de la création utilisateur.");
    }
    //end mdu 23/02/2026
    setNewRoleEmail("");
    setNewRoleName("");
    setNewRole("maitre_du_jeu");
    toast.success("Utilisateur ajouté.");
  };

  const removeRoleUser = async (id: string) => {
    //begin mdu 24/02/2026
    const newUser: RoleUser = {
      id: id,
      email: newRoleEmail,
      name: newRoleName,
      role: "",
    };
    deleteUser(newUser);
    //end mdu 24/02/2026
    setSiteConfig((prev) => ({
      ...prev,
      roleUsers: prev.roleUsers.filter((u) => u.id !== id),
    }));
    toast.success("Utilisateur supprimé.");
  };

  const updateRoleUser = async (id: string, role: UserRole) => {
    //begin mdu 24/02/2026
    const newUser: RoleUser = {
      id: id,
      email: newRoleEmail,
      name: newRoleName,
      role: role,
    };
    await updateUser(newUser);
    //end mdu 24/02/2026
    setSiteConfig((prev) => ({
      ...prev,
      roleUsers: prev.roleUsers.map((u) => (u.id === id ? { ...u, role } : u)),
    }));
  };

  async function createQuizz(config: SiteConfig, sourceDocument: string){
    try
    {
      setIsLoading(true);
      if (!sourceDocument) {
        toast.error("Aucun document source fourni");
        return;
      }

      // 1. Vérifier l'existence du fichier côté backend
      const checkResponse = await fetch("/api/check-file", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: sourceDocument}),
      });

      if (!checkResponse.ok) {
        toast.error("Erreur lors de la vérification du document");
        return;
      }

      const { exists } = await checkResponse.json() as { exists: boolean };

      if (!exists) {
        toast.error("Le document source n'existe pas sur le serveur.");
        return;
      }

      const response = await fetch("/api/send-pdf-to-n8n", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: sourceDocument, url: config.webhookUrl}),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'envoi du document");
      }

      const data = await response.json();
      const questions = Array.isArray(data) ? data : data[0]?.output;

      if (!questions || !Array.isArray(questions)) {
        toast.error("Format de questions invalide reçu de n8n");
        return;
      }

      setEditing(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          questions: questions,
        };
      });
    }
    catch(error) {
    toast.error("Une erreur est survenue lors de la création du quiz.");
    } finally {
      setIsLoading(false); // ✅ toujours appelé, même en cas d'erreur
    }
  }

  const roleLabels: Record<UserRole, { label: string; icon: React.ReactNode; color: string }> = {
    administrateur: { label: "Administrateur", icon: <Crown className="h-4 w-4" />, color: "text-destructive" },
    maitre_du_jeu: { label: "Maître du jeu", icon: <Shield className="h-4 w-4" />, color: "text-primary" },
    user: { label: "Utilisateur", icon: <Users className="h-4 w-4" />, color: "text-muted-foreground" },
  };
  return (
    <div className="min-h-screen bg-background">
      {isLoading && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm z-50 gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-300 border-t-primary" />
          <p className="text-sm font-medium text-muted-foreground animate-pulse">
            {loadingMessage}
          </p>
        </div>
      )}
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
                      onChange={(e) => {
                        setEditing({ ...editing, title: e.target.value });
                        if (e.target.value.trim()) setRegenErrors(prev => ({ ...prev, title: false }));
                      }}
                      placeholder="Ex: Cybersécurité avancée"
                      className={regenErrors.title ? "border-destructive ring-destructive" : ""}
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
                    onChange={(e) => {
                      setEditing({ ...editing, sourceDocument: e.target.value });
                      if (e.target.value.trim()) setRegenErrors(prev => ({ ...prev, sourceDocument: false }));
                    }}
                    placeholder="URL du document ou texte de référence envoyé à l'agent IA"
                    rows={3}
                    className={regenErrors.sourceDocument ? "border-destructive ring-destructive" : ""}
                  />
                </div>
                <div className="max-w-xs">
                  <Label>Nombre de questions</Label>
                  <Input
                    type="number"
                    min={1}
                    max={50}
                    value={editing.questionCount}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      setEditing({ ...editing, questionCount: val });
                      if (val >= 1) setRegenErrors(prev => ({ ...prev, questionCount: false }));
                    }}
                    className={regenErrors.questionCount ? "border-destructive ring-destructive" : ""}
                  />
                </div>
              </section>

              {/* Questions */}
              <section className="rounded-xl border border-border bg-card p-6 space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-foreground">
                    <Eye className="h-5 w-5 text-primary" />
                    Questions ({editing.questions.filter((q) => q.isActive).length} actives / {editing.questions.length} total)
                  </h2>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (!editing) return;
                        const errors = {
                          title: !editing.title.trim(),
                          sourceDocument: !editing.sourceDocument.trim(),
                          questionCount: !editing.questionCount || editing.questionCount < 1,
                        };
                        setRegenErrors(errors);
                        if (errors.title || errors.sourceDocument || errors.questionCount) {
                          toast.error("Veuillez remplir le titre, le document source et le nombre de questions avant de régénérer.");
                          return;
                        }
                        setShowRegenDialog(true);
                      }}
                      className="gap-2"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Régénérer
                    </Button>
                    {editing.questions.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowQuestions(!showQuestions)}
                        className="gap-2"
                      >
                        {showQuestions ? (
                          <>Masquer <ChevronUp className="h-4 w-4" /></>
                        ) : (
                          <>Aperçu <ChevronDown className="h-4 w-4" /></>
                        )}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Preview compact */}
                {!showQuestions && editing.questions.length > 0 && (
                  <div className="rounded-lg border border-border/50 bg-secondary/20 p-4 space-y-1.5">
                    {editing.questions.slice(0, 5).map((q, i) => (
                      <div key={q.id} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                          {i + 1}
                        </span>
                        <span className="truncate">{q.question}</span>
                        {!q.isActive && (
                          <span className="ml-auto shrink-0 rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                            Désactivée
                          </span>
                        )}
                      </div>
                    ))}
                    {editing.questions.length > 5 && (
                      <button
                        onClick={() => setShowQuestions(true)}
                        className="text-xs text-primary hover:underline mt-1"
                      >
                        + {editing.questions.length - 5} autres questions…
                      </button>
                    )}
                  </div>
                )}

                {editing.questions.length === 0 && !showQuestions && (
                  <div className="rounded-lg border border-dashed border-border p-8 text-center">
                    <p className="text-sm text-muted-foreground">
                      Aucune question. Cliquez sur « Régénérer » pour générer des questions via l'IA.
                    </p>
                  </div>
                )}

                {/* Full question list */}
                {showQuestions && (
                  <QuizQuestionViewer
                    config={editing}
                    onUpdate={(updated) => setEditing(updated)}
                    onToggleQuestion={(questionId) => editing && toggleQuestionActive(editing.id, questionId)}
                    onDeleteQuestion={(questionId) => editing && deleteQuestion(editing.id, questionId)}
                  />
                )}

                {/* Regenerate confirmation dialog */}
                <AlertDialog open={showRegenDialog} onOpenChange={setShowRegenDialog}>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Régénérer les questions ?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Toutes les questions existantes seront <span className="font-semibold text-foreground">définitivement supprimées</span> et remplacées par de nouvelles questions générées par l'IA à partir du document source. Cette action est irréversible.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={async() => {
                          toast.info("Régénération des questions via l'IA en cours…");
                          // TODO: appeler le webhook n8n pour régénérer les questions
                          createQuizz(siteConfig,editing.sourceDocument.trim());
                        }}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Régénérer
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
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
                {role === "administrateur" && (  // ← ajout
                    <TabsTrigger value="settings" className="gap-2">
                      <Settings className="h-4 w-4" />
                      Paramètres du site
                    </TabsTrigger>
                  )}
            </TabsList>

            {/* === Onglet Création de quiz === */}
            <TabsContent value="quizzes">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="mb-8 flex items-center justify-between">
                  <div>
                    <h1 className="font-heading text-2xl font-bold text-foreground">Mes Quiz</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                      {role === "administrateur"
                        ? "Tous les quiz (vue administrateur)"
                        : `Quiz créés par ${accessTokenPayload?.email}`}
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
                              onToggleQuestion={(questionId) => toggleQuestionActive(config.id, questionId)}
                              onDeleteQuestion={(questionId) => deleteQuestion(config.id, questionId)}
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
            {role === "administrateur" && (
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
            )}
          </Tabs>
        )}
      </main>
    </div>
  );
};

//begin mdu 23/02/2026
async function addUser(user: RoleUser): Promise<RoleUser> {
  const response = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    throw new Error("Erreur API");
  }

  return response.json();
}

async function updateConfig(config: SiteConfig): Promise<SiteConfig> {
  const newConfig : NewConfig = {
    webhook_url : config.webhookUrl,
    api_key : config.apiKey,
    max_api_retries : config.maxApiRetries,
    id : 1,
  };
  const response = await fetch("/api/config", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newConfig),
  });

  if (!response.ok) {
    throw new Error("Erreur API");
  }

  return response.json();
}


async function updateUser(user: RoleUser): Promise<RoleUser> {
  const response = await fetch("/api/usersUpdate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    throw new Error("Erreur API");
  }

  return response.json();
}

async function deleteUser(user: RoleUser){
  const response = await fetch("/api/userDelete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });

  if (!response.ok) {
    throw new Error("Erreur API");
  }
}



//end mdu 23/02/2026


export default AdminPage;
