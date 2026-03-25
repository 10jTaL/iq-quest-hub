import { Router } from "express";
import { createQuiz, updateQuiz, getAllQuizzes, deleteQuiz, toggleQuizActiveRoute, toggleQuestionActiveRoute, deleteQuestionRoute, getQuizBySlug } from "../controllers/quizController";

const router = Router();

router.get("/quiz", getAllQuizzes);       // Récupérer tous les quiz
router.post("/quiz", createQuiz);      // Créer un quiz
router.put("/quiz/:id", updateQuiz);   // Modifier un quiz
router.delete("/quiz/:id", deleteQuiz); // Supprimer un quiz
router.patch("/quiz/:id/active", toggleQuizActiveRoute);
router.patch("/question/:id/active", toggleQuestionActiveRoute);
router.delete("/question/:id", deleteQuestionRoute);
router.get("/quiz/:slug", getQuizBySlug);

export default router;