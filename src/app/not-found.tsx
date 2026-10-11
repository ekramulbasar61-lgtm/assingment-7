import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <div className="text-8xl mb-6">🛒</div>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">৪০৪ - পেজটি পাওয়া যায়নি</h1>
      <p className="text-gray-500 mb-8 max-w-md">
        আপনি যে পেজটি খুঁজছেন তা হয়তো সরিয়ে ফেলা হয়েছে অথবা কোনো ভুল লিঙ্কে প্রবেশ করেছেন।
      </p>
      <Link href="/" className="btn bg-green-600 hover:bg-green-700 text-white border-none rounded-full px-8">
        হোম পেজে ফিরে যান
      </Link>
    </div>
  );
}
