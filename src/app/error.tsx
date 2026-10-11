"use client";

import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application route failed to render", error);
  }, [error]);

  return (
    <main className="flex min-h-[60vh] flex-1 flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-3 text-2xl font-bold text-gray-900">
        পৃষ্ঠাটি দেখানো যাচ্ছে না
      </h1>
      <p className="mb-6 max-w-lg text-gray-600">
        সাময়িক সমস্যা হয়েছে। আবার চেষ্টা করুন, অথবা কিছুক্ষণ পর পৃষ্ঠাটি খুলুন।
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="btn border-none bg-green-700 text-white hover:bg-green-800"
      >
        আবার চেষ্টা করুন
      </button>
    </main>
  );
}
