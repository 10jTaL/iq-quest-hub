import { Request, Response } from "express";
import { findUserIdByEmail, findQuizIdBySlug, saveQuizResult, findUserResult, findAllResults } from "../db/quizResultRepository";

export const saveResult = async (req: Request, res: Response) => {
  const { email, quiz_slug, score, total_questions } = req.body;

  const user_id = await findUserIdByEmail(email) ?? "";
  const quiz_id = await findQuizIdBySlug(quiz_slug);

  if (!quiz_id) return res.status(404).json({ error: 'Quiz introuvable' });

  await saveQuizResult({ user_id, quiz_id, score, total_questions });
  res.json({ success: true });
};

export const getResult = async (req: Request, res: Response) => {
  const slug = req.params.slug as string;
  const { email } = req.query;

  const user_id = await findUserIdByEmail(email as string);
  const quiz_id = await findQuizIdBySlug(slug);

  if (!quiz_id || !user_id) return res.json(null);

  const result = await findUserResult(quiz_id, user_id);
  res.json(result ?? null);
};

export const getAllResults = async (req: Request, res: Response) => {
  const slug = req.params.slug as string;

  const quiz_id = await findQuizIdBySlug(slug);
  if (!quiz_id) return res.status(404).json({ error: 'Quiz introuvable' });

  const results = await findAllResults(quiz_id);
  res.json(results);
};