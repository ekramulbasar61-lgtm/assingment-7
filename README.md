# 🛒 বাজার দর (BazarDor)

**BazarDor** is a comprehensive daily market price tracking application. It provides users with up-to-date pricing information for essential commodities like rice, dal, oil, vegetables, fish, meat, eggs, and spices across various markets in Bangladesh. Users can easily view price fluctuations (increases and decreases), check market-specific price variations, and monitor the daily average cost of goods.

## 🚀 Live Demo
- **Live Link:** [Add your deployed link here]

## 🛠️ Technologies Used
- **Frontend Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS & DaisyUI
- **Authentication:** BetterAuth (Email/Password)
- **Database:** Neon PostgreSQL
- **Icons & UI:** Heroicons, React Hot Toast

## ✨ Key Features (Top 5)

1. **Daily Price Tracking & Trends:** Displays top rising and falling product prices dynamically on the home page, helping users identify market trends at a glance.
2. **Comprehensive Market Comparison:** Product details page provides in-depth data, showing the minimum, maximum, and average prices across different regional markets.
3. **Advanced Filtering & Sorting:** Users can easily sort products in any category by price (Low to High, High to Low) to find the best deals.
4. **Secure User Authentication:** Features login and registration using BetterAuth and PostgreSQL-backed accounts.
5. **Dynamic Profile Management:** Authenticated users can manage their accounts seamlessly, including updating their name and uploading a profile avatar that persists across sessions via local storage.

## 📦 Local Setup

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env.local`. The market API URL has a built-in default; set this optional override only to use a different compatible API:
   ```env
   # API_BASE_URL=https://openapi.programming-hero.com/api/bazardor
   ```
   Local development uses `sqlite.db` and a local-only auth secret by default. To use PostgreSQL locally, set `DATABASE_URL` and `BETTER_AUTH_SECRET`; generate the secret with `openssl rand -base64 32` and use a Neon pooled connection string with `sslmode=verify-full`. SQLite is for local development only; the database file is not deployed or persistent on Vercel.
4. Create the BetterAuth tables in the selected database if they do not already exist:
   ```bash
   npx @better-auth/cli migrate --config src/lib/auth.ts
   ```
   This creates the schema in the selected database; it does not import accounts between SQLite and PostgreSQL.
5. Start the development server:
   ```bash
   npm run dev
   ```
6. Open `http://localhost:3000` in your browser.

## 🚀 Deploy to Vercel

1. Push this repository to GitHub and import it in Vercel. Vercel should detect Next.js automatically; keep the default build command (`npm run build`) and output settings.
2. Create a Neon PostgreSQL database, either through the Vercel Marketplace or Neon, and copy its pooled connection string.
3. Add these environment variables in **Vercel → Project → Settings → Environment Variables**:
   - `DATABASE_URL`: the Neon pooled PostgreSQL connection string (use `sslmode=verify-full`)
   - `BETTER_AUTH_SECRET`: a unique value generated with `openssl rand -base64 32`
   - `BETTER_AUTH_URL`: your production origin, such as `https://your-project.vercel.app`
   - `API_BASE_URL` (optional): `https://openapi.programming-hero.com/api/bazardor` is the default
   - Optional OAuth: set `NEXT_PUBLIC_GOOGLE_CLIENT_ID` with `GOOGLE_CLIENT_SECRET`, and/or `NEXT_PUBLIC_GITHUB_CLIENT_ID` with `GITHUB_CLIENT_SECRET`. Configure each provider's callback URL as `https://your-domain/api/auth/callback/google` or `https://your-domain/api/auth/callback/github`.

   Add `DATABASE_URL` and `BETTER_AUTH_SECRET` to every Vercel environment that needs authentication. Production requires PostgreSQL and a secret; it never falls back to local SQLite. Set `BETTER_AUTH_URL` to the exact canonical site origin in Production. For Preview deployments, leave `BETTER_AUTH_URL` unset so the app uses Vercel's per-deployment `VERCEL_URL`. `BETTER_AUTH_URL` is also the origin Better Auth trusts; do not include a path such as `/api/auth`. The API URL is optional unless you are overriding the default. If enabling OAuth on previews, also register their exact callback URLs with each provider.
4. Before the first deployment, run `npx @better-auth/cli migrate --config src/lib/auth.ts` with `DATABASE_URL` set to the Neon database. Run the migration against the same Neon database configured in Vercel. Do not use a local SQLite database URL.
5. Deploy from Vercel. Authentication data is stored in Neon and will persist across serverless invocations. Existing users/accounts in local `sqlite.db` are **not** copied; export/import them separately if they must be retained, and do not point production at a local SQLite file.

### Diagnosing production authentication errors

The auth route uses Next.js's default Node.js runtime because Better Auth's PostgreSQL driver requires Node APIs. This project enables Cache Components, which does not allow overriding the route runtime explicitly. `better-sqlite3` is a native Node addon and is loaded only for local SQLite development; the SQLite file is writable locally but Vercel function filesystems are not a persistent database store. Production uses `DATABASE_URL` and Neon instead.

To inspect a signup failure, open **Vercel → Project → Logs** (or the failing deployment's **Functions/Runtime Logs** view), set the time range to include the request, and filter for `/api/auth/sign-up/email` or `[better-auth]`. The server logs include sanitized error names, database error codes, and messages; request bodies, passwords, session tokens, and configured secrets are not logged. A missing table/schema migration typically appears as a PostgreSQL missing-relation/schema error; a connection problem typically includes a PostgreSQL connection error code/message. Also verify `DATABASE_URL`, `BETTER_AUTH_SECRET`, and `BETTER_AUTH_URL` are present in the Production environment and redeploy after changing Vercel environment variables.
