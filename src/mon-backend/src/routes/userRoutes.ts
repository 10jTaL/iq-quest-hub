import { Router } from "express";
import { createUser, getAllUsers, updateUser, deleteUser,getUserRole } from "../controllers/userController";

const router = Router();

router.post("/users", createUser);
router.post("/usersUpdate", updateUser);
router.post("/userDelete", deleteUser);
router.get("/users", getAllUsers);
router.get('/users/role', getUserRole);

export default router;