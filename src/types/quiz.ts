export interface QuizAnswer {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  answers: QuizAnswer[];
  explanation: string;
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
}

export interface SiteConfig {
  webhookUrl: string;
  apiKey: string;
  maxApiRetries: number;
}
