import { betterAuth } from "better-auth";
import Database from "better-sqlite3";
import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;
const isProduction = process.env.NODE_ENV === "production";
const isProductionBuild = process.env.NEXT_PHASE === "phase-production-build";

if (isProduction && !databaseUrl && !isProductionBuild) {
  throw new Error("Missing DATABASE_URL environment variable.");
}

const secret =
  process.env.BETTER_AUTH_SECRET ??
  (!isProduction ? "local-development-secret-do-not-use-in-production" : undefined);
if (!secret) {
  throw new Error("Missing BETTER_AUTH_SECRET environment variable.");
}

const authBaseUrl =
  process.env.BETTER_AUTH_URL ??
  (process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000");

const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
if (Boolean(googleClientId) !== Boolean(googleClientSecret)) {
  throw new Error(
    "Set both NEXT_PUBLIC_GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to enable Google sign-in."
  );
}

const githubClientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;
if (Boolean(githubClientId) !== Boolean(githubClientSecret)) {
  throw new Error(
    "Set both NEXT_PUBLIC_GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET to enable GitHub sign-in."
  );
}

const database = databaseUrl
  ? {
      db: new Kysely({
        dialect: new PostgresDialect({
          pool: new Pool({
            connectionString: databaseUrl,
            max: 1,
          }),
        }),
      }),
      type: "postgres" as const,
    }
  : new Database(isProductionBuild ? ":memory:" : "sqlite.db");

export const auth = betterAuth({
  secret,
  baseURL: authBaseUrl,
  database,
  advanced: {
    database: {
      validateSchema: !isProductionBuild,
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    ...(googleClientId && googleClientSecret
      ? {
          google: {
            clientId: googleClientId,
            clientSecret: googleClientSecret,
          },
        }
      : {}),
    ...(githubClientId && githubClientSecret
      ? {
          github: {
            clientId: githubClientId,
            clientSecret: githubClientSecret,
          },
        }
      : {}),
  },
  user: {
    changeEmail: {
      enabled: true
    }
  }
});
