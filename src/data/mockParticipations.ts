export interface QuizParticipation {
  id: string;
  quizSlug: string;
  userName: string;
  correctAnswers: number;
  totalQuestions: number;
  completedAt: string;
}

export const mockParticipations: QuizParticipation[] = [
  { id: "p1", quizSlug: "cybersecurite-fondamentaux", userName: "Marie Dupont", correctAnswers: 4, totalQuestions: 5, completedAt: "2026-02-18T14:30:00" },
  { id: "p2", quizSlug: "cybersecurite-fondamentaux", userName: "Jean Martin", correctAnswers: 3, totalQuestions: 5, completedAt: "2026-02-18T10:15:00" },
  { id: "p3", quizSlug: "cybersecurite-fondamentaux", userName: "Sophie Leroy", correctAnswers: 5, totalQuestions: 5, completedAt: "2026-02-17T16:45:00" },
  { id: "p4", quizSlug: "cybersecurite-fondamentaux", userName: "Pierre Moreau", correctAnswers: 2, totalQuestions: 5, completedAt: "2026-02-17T09:20:00" },
  { id: "p5", quizSlug: "cybersecurite-fondamentaux", userName: "Camille Petit", correctAnswers: 4, totalQuestions: 5, completedAt: "2026-02-16T11:00:00" },
  { id: "p6", quizSlug: "rgpd-essentiels", userName: "Marie Dupont", correctAnswers: 3, totalQuestions: 4, completedAt: "2026-02-18T15:00:00" },
  { id: "p7", quizSlug: "rgpd-essentiels", userName: "Jean Martin", correctAnswers: 4, totalQuestions: 4, completedAt: "2026-02-17T12:00:00" },
  { id: "p8", quizSlug: "ia-generative", userName: "Sophie Leroy", correctAnswers: 2, totalQuestions: 4, completedAt: "2026-02-18T08:30:00" },
  { id: "p9", quizSlug: "ia-generative", userName: "Pierre Moreau", correctAnswers: 4, totalQuestions: 4, completedAt: "2026-02-16T14:00:00" },
];
