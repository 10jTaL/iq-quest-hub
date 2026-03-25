import { Router } from "express";
import { getConfig, updateConfig } from "../controllers/configController";

const router = Router();

//router.post("/users", createUser);
router.get("/config", getConfig);
router.post("/config",updateConfig)

export default router;