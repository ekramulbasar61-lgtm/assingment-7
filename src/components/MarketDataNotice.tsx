"use client";

import { useRouter } from "next/navigation";

export default function MarketDataNotice({
  empty = false,
}: {
  empty?: boolean;
}) {
  const router = useRouter();

  return (
    <div
      className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-center text-amber-950"
      role={empty ? "status" : "alert"}
    >
      <p className="font-semibold">
        {empty
          ? "বর্তমানে কোনো পণ্যের তথ্য পাওয়া যায়নি।"
          : "পণ্যের তথ্য লোড করা যায়নি। ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।"}
      </p>
      {!empty && (
        <button
          type="button"
          onClick={() => router.refresh()}
          className="btn btn-sm mt-3 border-none bg-green-700 text-white hover:bg-green-800"
        >
          আবার চেষ্টা করুন
        </button>
      )}
    </div>
  );
}
