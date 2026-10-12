import { betterAuth } from "better-auth";
import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;
const isProduction = process.env.NODE_ENV === "production";

if (isProduction && !databaseUrl) {
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
const trustedOrigins = new Set([new URL(authBaseUrl).origin]);

if (process.env.VERCEL_URL) {
  trustedOrigins.add(new URL(`https://${process.env.VERCEL_URL}`).origin);
}

function redactSensitiveValues(value: string): string {
  let safeValue = value;
  for (const secretValue of [
    databaseUrl,
    secret,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GITHUB_CLIENT_SECRET,
  ]) {
    if (secretValue) safeValue = safeValue.replaceAll(secretValue, "[REDACTED]");
  }

  return safeValue
    .replace(/(postgres(?:ql)?:\/\/)[^\s@]+@/gi, "$1[REDACTED]@")
    .replace(
      /((?:password|secret|token|authorization|cookie)\s*[=:]\s*)(?:"[^"]*"|'[^']*'|[^\s,;]+)/gi,
      "$1[REDACTED]"
    )
    .slice(0, 2000);
}

function summarizeAuthError(error: unknown) {
  if (!(error instanceof Error)) {
    return { type: typeof error };
  }

  const code =
    "code" in error && typeof error.code === "string" ? error.code : undefined;

  return {
    name: error.name,
    ...(code ? { code } : {}),
    message: redactSensitiveValues(error.message),
  };
}

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
  : await (async () => {
      const { default: Database } = await import("better-sqlite3");
      return new Database("sqlite.db");
    })();

export const auth = betterAuth({
  secret,
  baseURL: authBaseUrl,
  trustedOrigins: [...trustedOrigins],
  database,
  logger: {
    level: "error",
    log: (_level, message, ...args) => {
      const errorSummaries = args
        .filter((arg): arg is Error => arg instanceof Error)
        .map(summarizeAuthError);
      console.error(
        "[better-auth]",
        redactSensitiveValues(message),
        ...errorSummaries
      );
    },
  },
  onAPIError: {
    onError: (error) => {
      console.error("[better-auth] API request failed", summarizeAuthError(error));
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
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
