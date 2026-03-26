import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { connectDb } from "./db/client";
import userRoutes from "./routes/userRoutes";
import configRoutes from "./routes/configRoutes";
import fileRoutes from "./routes/fileRoutes";
import quizRoutes from "./routes/quizRoutes";
import quizResultRoutes from "./routes/quizResultRoutes";
import https from "https";
import fs from "fs";
// plus tard : import userRoutes from "./routes/userRoutes";



// donnera POST /api/users

async function bootstrap() {
  // 1. Connexion BDD
  await connectDb();

  // 2. Création de l'app Express
  const app = express();

  // 3. Middlewares
  app.use(cors());
  app.use(express.json());

  app.use("/api", userRoutes);
  app.use("/api", configRoutes);
  app.use("/api", fileRoutes);
  app.use("/api", quizRoutes);
  app.use("/api", quizResultRoutes);

  // 4. Route de test
  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  // plus tard : app.use("/api", userRoutes);

  /* const keyPath = process.env.SSL_KEY_PATH || "/home/test/key.pem";
   const certPath = process.env.SSL_CERT_PATH || "/home/test/cert.pem";
 
   const httpsOptions = {
     key: fs.readFileSync(keyPath),
     cert: fs.readFileSync(certPath),
   };*/
  /*const PORT = parseInt(process.env.PORT || "3000", 10);
  https.createServer(httpsOptions, app).listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on https://0.0.0.0:${PORT}`);
  });*/
  const PORT = parseInt(process.env.PORT || "3000", 10);
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
  });
  // 5. Démarrage du serveur
  /*const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });*/
}

bootstrap().catch((err) => {
  console.error("❌ Failed to start server", err);
  process.exit(1);
});