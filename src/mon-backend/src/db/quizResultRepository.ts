import { client } from "./client";

export const findUserIdByEmail = async (email: string): Promise<string | null> => {
  const result = await client.query(
    'SELECT id FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0]?.id ?? null;
};

// Récupère le quiz_id depuis le slug
export const findQuizIdBySlug = async (slug: string): Promise<string | null> => {
  const result = await client.query(
    'SELECT id FROM quizzes WHERE slug = $1',
    [slug]
  );
  return result.rows[0]?.id ?? null;
};

interface QuizResultPayload {
  user_id: string;
  quiz_id: string;
  score: number;
  total_questions: number;
}
// Sauvegarde la participation
export const saveQuizResult = async ({ user_id, quiz_id, score, total_questions }: QuizResultPayload) => {
  const percentage = Math.round((score / total_questions) * 100);
  await client.query(
    `INSERT INTO participations (user_id, quiz_id, score, total_questions, percentage)
     VALUES ($1, $2, $3, $4, $5)`,
    [user_id, quiz_id, score, total_questions, percentage]
  );
};

// Récupère le dernier résultat d'un user pour un quiz
export const findUserResult = async (quiz_id: string, user_id: string) => {
  const result = await client.query(
    `SELECT p.score, p.total_questions, p.percentage, p.completed_at
     FROM participations p
     WHERE p.quiz_id = $1 AND p.user_id = $2
     ORDER BY p.completed_at DESC LIMIT 1`,
    [quiz_id, user_id]
  );
  return result.rows[0] ?? null;
};

export const findAllResults = async (quiz_id: string) => {
  const result = await client.query(
    `SELECT DISTINCT ON (u.email)
       u.email,
       p.score,
       p.total_questions,
       p.percentage,
       p.completed_at
     FROM participations p
     JOIN users u ON u.id = p.user_id
     WHERE p.quiz_id = $1
     ORDER BY u.email, p.completed_at DESC`,
    [quiz_id]
  );
  return result.rows;
};