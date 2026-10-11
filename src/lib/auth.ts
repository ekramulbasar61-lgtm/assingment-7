import { betterAuth } from "better-auth";
import Database from "better-sqlite3";

const db = new Database("sqlite.db");

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET || "bazar-dor-auth-secret-2026-strong-32-characters",
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  database: db,
  emailAndPassword: {
    enabled: true,
  },
  user: {
    changeEmail: {
      enabled: true
    }
  }
});
