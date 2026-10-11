"use client";

import Link from "next/link";
import { useState } from "react";
import type { Category, Product } from "@/lib/market-data";

const unitMap: Record<string, string> = {
  kg: "কেজি",
  piece: "পিস",
  hali: "হালি",
  dozen: "ডজন",
  liter: "লিটার",
  bundle: "আঁটি"
};

const engToBdNum = (numStr: string) => {
  const bdDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return numStr.replace(/[0-9]/g, (w) => bdDigits[+w]);
};

export default function CategoryClient({ 
  initialProducts, 
  category 
}: { 
  initialProducts: Product[], 
  category: Category 
}) {
  const [sortOption, setSortOption] = useState<string>("default");

  const sortedProducts = [...initialProducts];
  if (sortOption === "price_asc") {
    sortedProducts.sort((a, b) => a.today - b.today);
  } else if (sortOption === "price_desc") {
    sortedProducts.sort((a, b) => b.today - a.today);
  }

  const getChangeBadge = (change: { dir: string, pct: number }) => {
    const formattedPct = engToBdNum(change.pct.toFixed(1));
    if (change.dir === "up") {
      return (
        <span className="inline-flex items-center gap-1 bg-red-50 text-red-500 font-bold px-2 py-1 rounded text-xs">
          ▲ {formattedPct}%
        </span>
      );
    } else if (change.dir === "down") {
      return (
        <span className="inline-flex items-center gap-1 bg-green-50 text-green-600 font-bold px-2 py-1 rounded text-xs">
          ▼ {formattedPct}%
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-500 font-bold px-2 py-1 rounded text-xs">
        — {formattedPct}%
      </span>
    );
  };

  return (
    <div className="bg-[#f2f4f2] min-h-screen py-8">
      <div className="container mx-auto max-w-5xl px-4">
        
        {/* Top Header Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-4 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-4xl shrink-0">
            {category.icon}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{category.nameBn}</h1>
            <p className="text-gray-500 text-sm">
              {engToBdNum(initialProducts.length.toString())}টি পণ্যের আজকের দাম ও পরিবর্তন
            </p>
          </div>
        </div>

        {/* Filter / Sort Row */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6 flex justify-end items-center">
          <div className="flex items-center gap-3">
            <span className="text-gray-600 font-medium text-sm">সাজান</span>
            <select 
              className="select select-bordered select-sm bg-white focus:outline-none focus:ring-1 focus:ring-green-500"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="default">ডিফল্ট</option>
              <option value="price_asc">দাম: কম থেকে বেশি</option>
              <option value="price_desc">দাম: বেশি থেকে কম</option>
            </select>
          </div>
        </div>

        {/* Count Label */}
        <div className="mb-4">
          <p className="text-sm text-gray-500 font-medium">
            মোট {engToBdNum(initialProducts.length.toString())}টি পণ্য দেখানো হচ্ছে
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProducts.map((product) => (
            <Link href={`/product/${product.id}`} key={product.id}>
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col justify-between">
                <div>
                  <div className="flex gap-4 items-start mb-6">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl shrink-0">
                      {product.image}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 leading-tight mb-1">{product.nameBn}</h3>
                      <p className="text-gray-500 text-xs">প্রতি {unitMap[product.unit] || product.unit}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-end justify-between mt-auto">
                  <div>
                    <p className="text-gray-500 text-xs mb-1">আজকের দাম</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {engToBdNum(product.today.toString())} <span className="text-sm font-normal text-gray-700">টাকা</span>
                    </p>
                  </div>
                  <div>
                    {getChangeBadge(product.change)}
                  </div>
                </div>
              </div>
            </Link>
          ))}
          
          {sortedProducts.length === 0 && (
            <div className="col-span-full text-center py-16 px-4 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
              <div className="text-6xl mb-4">🛒</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">পণ্য পাওয়া যায়নি</h2>
              <p className="text-gray-500 mb-6">দুঃখিত, এই ক্যাটাগরিতে বর্তমানে কোনো পণ্য নেই।</p>
              <Link href="/" className="btn bg-green-600 hover:bg-green-700 text-white border-none rounded-full px-8">
                হোম পেজে ফিরে যান
              </Link>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
