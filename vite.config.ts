import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import fs from 'fs';
import federation from "@originjs/vite-plugin-federation";

export default defineConfig(({ mode }) => ({
  preview: {
    host: "0.0.0.0",
    port: 8085,
    strictPort: true,
    '/api': {
      target: 'http://quizzbackend:3000',
      changeOrigin: true,
      secure: false,
    }
  },
  server: {
    host: "atl-svap21.cipeliagroup.com",
    port: 8085,
    https: {
      key: fs.readFileSync("./src/key.pem"),
      cert: fs.readFileSync("./src/cert.pem"),
    },
    hmr: {
      protocol: "wss",
      host: "atl-svap21.cipeliagroup.com",
      port: 8085,
    },
    proxy: {
      '/adfs': {
        target: 'https://adfs.cipeliagroup.com',
        changeOrigin: true,
        secure: false,
      },
      '/api': {
        target: 'http://quizzbackend:3000',
        changeOrigin: true,
        secure: false,
      }
    },
    cors: {
      origin: "https://atl-svap21.cipeliagroup.com:8085",
      credentials: true,
    }
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    federation({
      name: "QuizHub",                // nom de l'app côté fédération
      filename: "remoteEntry.js",            // fichier que l'intranet chargera
      exposes: {
        "./App": "./src/App.tsx",            // ce que tu exposes à l'intranet
      },
      shared: ["react", "react-dom"],        // partagé avec le host
    }),
  ].filter(Boolean),
  build: {
    modulePreload: false,
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));