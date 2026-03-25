import { Request, Response } from "express";
import { getConfigFromDb, updateConfigFromDb, Newconfig } from "../db/configRepository";


export async function updateConfig(req: Request, res: Response) {
  try {
    const { webhook_url, api_key, max_api_retries, id } = req.body
    // Validation minimale
    if (!webhook_url) {
      return res.status(400).json({ message: "webhook_url are required" });
    }

    const newUser = await updateConfigFromDb({
      webhook_url,
      api_key,
      max_api_retries,
      id
    });

    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getConfig(_req: Request, res: Response) {
  try {
    const config = await getConfigFromDb();
    return res.status(200).json(config);
  } catch (err) {
    console.error("Erreur getAllUsers", err);
    return res.status(500).json({ message: "Internal server error" });
  }
}