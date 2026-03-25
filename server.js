import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createProxyMiddleware } from "http-proxy-middleware";
import https from "https";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8085;

// Chemins vers tes certifs DANS le container
const keyPath = process.env.SSL_KEY_PATH || "C:/certs/key.pem";
const certPath = process.env.SSL_CERT_PATH || "C:/certs/cert.pem";

const credentials = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath),
};

// Dossier buildé par Vite
const distPath = path.join(__dirname, "dist");

// Proxy /adfs -> ADFS
app.use(
    "/adfs",
    createProxyMiddleware({
        target: "https://adfs.cipeliagroup.com",
        changeOrigin: true,
        secure: false, // self-signed côté ADFS
    })
);

// Proxy /api -> backend Docker (HTTP ou HTTPS selon ton backend)
app.use(
    "/api",
    createProxyMiddleware({
        target: "http://quizzbackend:3000",
        changeOrigin: true,
        secure: false,
    })
);

// Fichiers statiques du front
app.use(express.static(distPath));

// SPA fallback
app.use((req, res, next) => {
    res.sendFile(path.join(distPath, "index.html"));
});

// Lancement serveur HTTPS
https.createServer(credentials, app).listen(PORT, () => {
    console.log(`HTTPS frontend + proxy listening on port ${PORT}`);
});