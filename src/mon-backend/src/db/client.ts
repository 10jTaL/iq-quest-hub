import dotenv from "dotenv";
dotenv.config(); // ✅ doit être AVANT toute lecture de process.env
import { Client, Pool } from "pg";



const dbConfig = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 5432),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD ?? "",  // ✅ fallback string vide comme ton Client
  database: process.env.DB_NAME,
};

export const client = new Client(dbConfig);
export const pool = new Pool(dbConfig);

export async function connectDb() {
  try {
    await client.connect();
    console.log("✅ Connected to PostgreSQL");
  } catch (err) {
    console.error("❌ Failed to connect to PostgreSQL", err);
    throw err;
  }
}