import Link from "next/link";
import { notFound } from "next/navigation";
import { apiUrls } from "@/lib/api";

// Define TypeScript interfaces for our product data
interface Market {
  market: string;
  division: string;
  min: number;
  max: number;
}

interface Product {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string;
  image: string;
  today: number;
  yesterday: number;
  lastWeek: number;
  lastMonth: number;
  change: {
    dir: string;
    pct: number;
  };
  markets: Market[];
}

// Map english units to bengali
const unitMap: Record<string, string> = {
  kg: "কেজি",
  piece: "পিস",
  hali: "হালি",
  dozen: "ডজন",
  liter: "লিটার",
  bundle: "আঁটি"
};

async function getProduct(id: string): Promise<Product | null> {
  const res = await fetch(apiUrls.products);
  if (!res.ok) return null;
  const products: Product[] = await res.json();
  return products.find(p => p.id.toString() === id || p.slug === id) || null;
}

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const instant = false;

export default async function ProductDetailsPage({ params }: { params: { id: string } }) {
  // Check auth
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    redirect("/signin");
  }

  // Need to await params in newer Next.js versions
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  // Formatting variables
  const unitBn = unitMap[product.unit] || product.unit;
  const priceDiff = Math.abs(product.today - product.yesterday);
  const diffText = product.change.dir === 'up' ? 'বেড়েছে' : product.change.dir === 'down' ? 'কমেছে' : 'অপরিবর্তিত আছে';
  
  // Calculate lowest and highest across markets
  const validMarkets = product.markets?.filter(m => m.min > 0 && m.max > 0) || [];
  
  let minMarket = null;
  let maxMarket = null;
  let minPrice = Infinity;
  let maxPrice = 0;

  if (validMarkets.length > 0) {
    minMarket = validMarkets.reduce((prev, curr) => (prev.min < curr.min ? prev : curr));
    minPrice = minMarket.min;
    
    maxMarket = validMarkets.reduce((prev, curr) => (prev.max > curr.max ? prev : curr));
    maxPrice = maxMarket.max;
  } else {
    minPrice = product.today;
    maxPrice = product.today;
  }

  return (
    <div className="bg-[#f2f4f2] min-h-screen py-8">
      <div className="container mx-auto max-w-5xl px-4">
        
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-green-600">হোম</Link>
          <span>›</span>
          <Link href={`/category/${product.category}`} className="hover:text-green-600">{product.categoryNameBn}</Link>
          <span>›</span>
          <span className="text-gray-900">{product.nameBn}</span>
        </div>

        {/* Top Header Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center text-5xl">
              {product.image}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.nameBn}</h1>
              <p className="text-gray-500 mb-2">প্রতি {unitBn} • {product.categoryNameBn}</p>
              <p className="text-sm text-gray-600">
                গতকালের তুলনায় আজ দাম <span className="font-semibold">{diffText} • {priceDiff} টাকা</span>
              </p>
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-5 text-center min-w-[160px] w-full md:w-auto">
            <p className="text-gray-500 text-sm mb-1">আজকের দাম</p>
            <p className="text-4xl font-bold text-gray-900 mb-1">{product.today}</p>
            <p className="text-gray-500 text-sm mb-2">টাকা / {unitBn}</p>
            {product.change.dir === 'up' && (
              <p className="text-red-500 text-sm font-bold flex justify-center items-center gap-1">
                ▲ {product.change.pct}%
              </p>
            )}
            {product.change.dir === 'down' && (
              <p className="text-green-600 text-sm font-bold flex justify-center items-center gap-1">
                ▼ {Math.abs(product.change.pct)}%
              </p>
            )}
            {product.change.dir === 'flat' && (
              <p className="text-gray-400 text-sm font-bold">
                —
              </p>
            )}
          </div>
        </div>

        {/* Details Wrapper */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">দামের সারসংক্ষেপ</h2>
          
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Min Price Card */}
            <div className="border border-gray-200 rounded-xl p-5">
              <p className="text-gray-500 text-sm mb-2">সর্বনিম্ন দাম</p>
              <p className="text-3xl font-bold text-green-600 mb-2">{minPrice} <span className="text-lg font-normal text-green-600">টাকা</span></p>
              <p className="text-gray-500 text-xs">সবচেয়ে কম দামের বাজার ({minMarket?.market || 'N/A'})</p>
            </div>
            
            {/* Max Price Card */}
            <div className="border border-gray-200 rounded-xl p-5">
              <p className="text-gray-500 text-sm mb-2">সর্বোচ্চ দাম</p>
              <p className="text-3xl font-bold text-red-500 mb-2">{maxPrice} <span className="text-lg font-normal text-red-500">টাকা</span></p>
              <p className="text-gray-500 text-xs">সবচেয়ে বেশি দামের বাজার ({maxMarket?.market || 'N/A'})</p>
            </div>
            
            {/* Avg Price Card */}
            <div className="border border-gray-200 rounded-xl p-5">
              <p className="text-gray-500 text-sm mb-2">গড় দাম</p>
              <p className="text-3xl font-bold text-gray-900 mb-2">{product.today} <span className="text-lg font-normal text-gray-900">টাকা</span></p>
              <p className="text-gray-500 text-xs">প্রতি {unitBn}-এর হিসাবে</p>
            </div>
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-4">বাজারভিত্তিক আজকের দাম</h2>
          
          <div className="overflow-x-auto">
            <table className="table w-full border border-gray-200 rounded-lg">
              {/* head */}
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="font-semibold px-4 py-3">বাজার</th>
                  <th className="font-semibold px-4 py-3">বিভাগ</th>
                  <th className="font-semibold px-4 py-3">সর্বনিম্ন</th>
                  <th className="font-semibold px-4 py-3">সর্বোচ্চ</th>
                  <th className="font-semibold px-4 py-3 text-right">গড়</th>
                </tr>
              </thead>
              <tbody>
                {validMarkets.map((market, index) => {
                  const avg = (market.min + market.max) / 2;
                  return (
                    <tr key={index} className="hover border-t border-gray-200 text-sm">
                      <td className="px-4 py-3 text-gray-900 font-medium">{market.market}</td>
                      <td className="px-4 py-3 text-gray-600">{market.division}</td>
                      <td className="px-4 py-3 text-gray-600">{market.min} টাকা</td>
                      <td className="px-4 py-3 text-gray-600">{market.max} টাকা</td>
                      <td className="px-4 py-3 text-right font-medium text-gray-900">{avg % 1 === 0 ? avg : avg.toFixed(2)} টাকা</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            
            {validMarkets.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                কোনো বাজারের তথ্য পাওয়া যায়নি
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
