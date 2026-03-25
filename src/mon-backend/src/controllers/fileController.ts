import { Request, Response } from "express";
import fs from "fs/promises";

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export async function checkFileExists(req: Request, res: Response) {
  const { path } = req.body as { path?: string };
  if (!path) {
    return res.status(400).json({ exists: false, message: "Chemin manquant" });
  }

  try {
    await fs.access(path);
    return res.status(200).json({ exists: true });
  } catch {
    return res.status(200).json({ exists: false });
  }
}

export async function sendPdfToN8n(req: Request, res: Response) {
  const { path, url } = req.body as { path?: string; url?: string };

  if (!path || !url) {
    return res.status(400).json({ message: "Chemin ou URL manquants" });
  }

  try {
    const fileBuffer = await fs.readFile(path);
    const base64 = fileBuffer.toString("base64");

    const n8nResponse = await fetch(url, {
      method: "POST",
      body: base64,
    });

    if (!n8nResponse.ok) {
      console.error("Réponse n8n KO", n8nResponse.status, await n8nResponse.text());
      return res.status(500).json({ message: "Erreur lors de l'envoi à n8n" });
    }

    const data = await n8nResponse.json();
    console.log(data);
    return res.status(200).json(data);
  } catch (err) {
    console.error("Erreur sendPdfToN8n", err);
    return res.status(500).json({ message: "Erreur serveur lors de la lecture du fichier" });
  }
}
