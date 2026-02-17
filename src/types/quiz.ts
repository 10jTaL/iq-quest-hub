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
  webhookUrl: string;
  apiKey: string;
  sourceDocument: string;
  questionCount: number;
  maxApiRetries: number;
  resultMessages: ResultMessage[];
}
