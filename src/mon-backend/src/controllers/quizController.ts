import { Request, Response } from "express";
import { getAllQuizzesFromDb, createQuizInDb, updateQuizInDb, deleteQuizFromDb, NewQuiz, toggleQuizActiveInDb, toggleQuestionActiveInDb, deleteQuestionFromDb, getQuizBySlugFromDb } from "../db/quizzRepository";

export async function getAllQuizzes(req: Request, res: Response) {
  try {
    const quizzes = await getAllQuizzesFromDb();
    return res.status(200).json(quizzes);
  } catch (err) {
    console.error("Erreur getAllQuizzes", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function createQuiz(req: Request, res: Response) {
  try {
    const quiz = req.body as NewQuiz;
    if (!quiz.title || !quiz.slug) {
      return res.status(400).json({ message: "Title and slug are required" });
    }
    const newQuiz = await createQuizInDb(quiz);
    return res.status(201).json(newQuiz);
  } catch (err) {
    console.error("Erreur createQuiz", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateQuiz(req: Request, res: Response) {
  try {
    const quiz = req.body as NewQuiz;
    const updatedQuiz = await updateQuizInDb(quiz);
    return res.status(200).json(updatedQuiz);
  } catch (err) {
    console.error("Erreur updateQuiz", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteQuiz(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    await deleteQuizFromDb(id);
    return res.status(200).json({ message: "Quiz supprimé" });
  } catch (err) {
    console.error("Erreur deleteQuiz", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function toggleQuizActiveRoute(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const { isActive } = req.body as { isActive: boolean };
    await toggleQuizActiveInDb(id, isActive);
    return res.status(200).json({ message: "Statut mis à jour" });
  } catch (err) {
    console.error("Erreur toggleQuizActive", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function toggleQuestionActiveRoute(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    const { isActive } = req.body as { isActive: boolean };
    await toggleQuestionActiveInDb(id, isActive);
    return res.status(200).json({ message: "Statut question mis à jour" });
  } catch (err) {
    console.error("Erreur toggleQuestionActive", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteQuestionRoute(req: Request, res: Response) {
  try {
    const id = req.params.id as string;
    await deleteQuestionFromDb(id);
    return res.status(200).json({ message: "Question supprimée" });
  } catch (err) {
    console.error("Erreur deleteQuestion", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getQuizBySlug(req: Request, res: Response) {
  try {
    const slug = req.params.slug as string;
    const quiz = await getQuizBySlugFromDb(slug);
    if (!quiz) return res.status(404).json({ message: "Quiz introuvable" });
    return res.status(200).json(quiz);
  } catch (err) {
    console.error("Erreur getQuizBySlug", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}
