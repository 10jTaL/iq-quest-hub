export interface QuizAnswer {
  id: string;
  text: string;
  isCorrect: boolean;
  isActive: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  answers: QuizAnswer[];
  explanation: string;
  isActive: boolean;
}

export interface Quiz {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  iconColor?: "blue" | "orange" | "red" | "green" | "purple" | "teal";
  questionCount: number;
  introduction: string;
  questions: QuizQuestion[];
  resultMessages: ResultMessage[];
  isActive: boolean;
  createdBy: string;
}

export interface ResultMessage {
  minScore: number;
  maxScore: number;
  title: string;
  message: string;
}

export interface QuizConfig {
  id: string;
  title: string;
  slug: string;
  description: string;
  introduction: string;
  icon: string;
  sourceDocument: string;
  questionCount: number;
  resultMessages: ResultMessage[];
  isActive: boolean;
  createdBy: string;
  questions: QuizQuestion[];
}

export type UserRole = "user" | "maitre_du_jeu" | "administrateur";

export interface RoleUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface SiteConfig {
  webhookUrl: string;
  apiKey: string;
  maxApiRetries: number;
  roleUsers: RoleUser[];
}
