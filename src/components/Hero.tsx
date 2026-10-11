import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  const today = new Date();
  const formattedDate = new Intl.DateTimeFormat("bn-BD", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(today);

  return (
    <section className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-8 mb-16 relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-green-50 rounded-full blur-3xl opacity-50 -z-10 translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="flex-1 space-y-4">
        <div className="inline-block px-3 py-1 bg-green-50 text-green-700 text-sm font-medium rounded-full mb-2 border border-green-100">
          {formattedDate}
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
          আজকের বাজারের দাম <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">এক নজরে</span>
        </h1>
        
        <p className="text-gray-500 max-w-xl text-lg pt-2">
          চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বোচ্চ এবং দামের পরিবর্তনের এক জায়গায়।
        </p>
        
        <div className="pt-4">
          <Link href="#all-products" className="btn btn-primary bg-green-600 hover:bg-green-700 border-none text-white px-8 rounded-full shadow-lg shadow-green-200 transition-all hover:shadow-green-300">
            সব পণ্য দেখুন
          </Link>
        </div>
      </div>
      
      <div className="w-full md:w-1/3 flex justify-center relative">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-50 to-transparent rounded-full opacity-50 blur-xl"></div>
        <Image 
          src="/bazar-hero.png" 
          alt="Bazar basket" 
          width={400} 
          height={300} 
          className="relative z-10 w-full max-w-[280px] drop-shadow-2xl"
          priority
        />
      </div>
    </section>
  );
}
