import { Router } from "express";
import { saveResult, getResult, getAllResults } from "../controllers/quizResultController";

const router = Router();

router.post('/participations', saveResult);
router.get('/participations/:slug', getResult);
router.get('/participations/:slug/all', getAllResults);

export default router;