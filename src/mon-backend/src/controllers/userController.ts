import { Request, Response } from "express";
import { createUserInDb, NewUser, getAllUsersFromDb, updateUserInDb, deleteUserInDb, findUserRoleByEmail } from "../db/userRepository";

export async function createUser(req: Request, res: Response) {
  try {
    const { name, email, role } = req.body;
    if (!name || !email) return res.status(400).json({ error: "Missing fields" });

    const safeRole = role ?? "USER";

    const newUser = await createUserInDb({
      name,
      email,
      role: safeRole as NewUser["role"],
      id: ""
    });

    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getAllUsers(_req: Request, res: Response) {
  try {
    const users = await getAllUsersFromDb();
    return res.status(200).json(users);
  } catch (err) {
    console.error("Erreur getAllUsers", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateUser(req: Request, res: Response) {
  try {
    const { name, email, role, id } = req.body;

    const safeRole = role ?? "USER";

    const newUser = await updateUserInDb({
      name,
      email,
      role: safeRole as NewUser["role"],
      id,
    });

    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteUser(req: Request, res: Response) {
  try {
    const { name, email, role, id } = req.body;
    await deleteUserInDb({
      name,
      email,
      role,
      id,
    });

    res.status(201);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const getUserRole = async (req: Request, res: Response) => {
  const { email } = req.query;

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email requis' });
  }

  const role = await findUserRoleByEmail(email);
  res.json({ role: role ?? 'user' });
};

