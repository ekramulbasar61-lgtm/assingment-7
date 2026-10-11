# 🛒 বাজার দর (BazarDor)

**BazarDor** is a comprehensive daily market price tracking application. It provides users with up-to-date pricing information for essential commodities like rice, dal, oil, vegetables, fish, meat, eggs, and spices across various markets in Bangladesh. Users can easily view price fluctuations (increases and decreases), check market-specific price variations, and monitor the daily average cost of goods.

## 🚀 Live Demo
- **Live Link:** [Add your deployed link here]

## 🛠️ Technologies Used
- **Frontend Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS & DaisyUI
- **Authentication:** BetterAuth (Email/Password & OAuth)
- **Database:** SQLite (BetterSQLite3)
- **Icons & UI:** Heroicons, React Hot Toast

## ✨ Key Features (Top 5)

1. **Daily Price Tracking & Trends:** Displays top rising and falling product prices dynamically on the home page, helping users identify market trends at a glance.
2. **Comprehensive Market Comparison:** Product details page provides in-depth data, showing the minimum, maximum, and average prices across different regional markets.
3. **Advanced Filtering & Sorting:** Users can easily sort products in any category by price (Low to High, High to Low) to find the best deals.
4. **Secure User Authentication:** Features a robust login and registration system using BetterAuth, allowing users to securely access protected routes like the Product Details and Profile pages.
5. **Dynamic Profile Management:** Authenticated users can manage their accounts seamlessly, including updating their name and uploading a profile avatar that persists across sessions via local storage.

## 📦 Local Setup Instructions

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure the API base URL in `.env` (or copy `.env.example`):
   ```env
   API_BASE_URL=https://openapi.programming-hero.com/api/bazardor
   ```
   Set `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL=http://localhost:3000` there as needed.
4. Run the database migration for BetterAuth:
   ```bash
   npx @better-auth/cli migrate
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```
6. Open `http://localhost:3000` in your browser.
