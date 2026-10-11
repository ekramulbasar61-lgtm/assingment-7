"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application root failed to render", error);
  }, [error]);

  return (
    <html lang="bn">
      <body className="flex min-h-screen flex-col items-center justify-center bg-white px-4 text-center text-gray-900">
        <h1 className="mb-3 text-2xl font-bold">ওয়েবসাইটটি লোড করা যায়নি</h1>
        <p className="mb-6 max-w-lg text-gray-600">
          সাময়িক সমস্যা হয়েছে। আবার চেষ্টা করুন, অথবা কিছুক্ষণ পর পৃষ্ঠাটি খুলুন।
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-lg bg-green-700 px-5 py-3 font-semibold text-white"
        >
          আবার চেষ্টা করুন
        </button>
      </body>
    </html>
  );
}
