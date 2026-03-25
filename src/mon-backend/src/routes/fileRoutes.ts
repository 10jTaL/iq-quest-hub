import { Router } from "express";
import { checkFileExists, sendPdfToN8n } from "../controllers/fileController";

const router = Router();

router.post("/check-file", checkFileExists);
router.post("/send-pdf-to-n8n", sendPdfToN8n);

export default router;