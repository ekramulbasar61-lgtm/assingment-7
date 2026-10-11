export const instant = false;

import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import { apiUrls } from "@/lib/api";

interface ProductItem {
  id: number;
  slug: string;
  nameBn: string;
  unit: string;
  today: number;
  image: string;
  change: {
    dir: "up" | "down" | "flat";
    pct: number;
  };
}

async function getProducts(): Promise<ProductItem[]> {
  const res = await fetch(apiUrls.products);
  if (!res.ok) return [];
  return (await res.json()) as ProductItem[];
}

export default async function Home() {
  const products = await getProducts();

  const increasedProducts = [...products]
    .filter((product) => product.change?.dir === "up")
    .sort((a, b) => b.change.pct - a.change.pct)
    .slice(0, 6);

  const decreasedProducts = [...products]
    .filter((product) => product.change?.dir === "down")
    .sort((a, b) => Math.abs(b.change.pct) - Math.abs(a.change.pct))
    .slice(0, 6);

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <Hero />

      <section className="mb-12">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-red-500 text-xl">▲</span>
          <h2 className="text-2xl font-bold text-gray-900">আজ দাম বেড়েছে</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {increasedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="mb-12">
        <div className="flex items-center gap-2 mb-6">
          <span className="text-green-600 text-xl">▼</span>
          <h2 className="text-2xl font-bold text-gray-900">আজ দাম কমেছে</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {decreasedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section id="all-products" className="scroll-mt-32">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">সব পণ্য</h2>
          <p className="text-gray-500 text-sm mt-1">সবগুলো পণ্যের আজকের দাম</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
