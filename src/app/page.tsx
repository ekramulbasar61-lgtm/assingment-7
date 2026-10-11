import Hero from "@/components/Hero";
import MarketDataNotice from "@/components/MarketDataNotice";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/market-data";
import { connection } from "next/server";

export const instant = false;

export default async function Home() {
  await connection();
  const { items: products, error } = await getProducts();

  const increasedProducts = [...products]
    .filter((product) => product.change.dir === "up")
    .sort((a, b) => b.change.pct - a.change.pct)
    .slice(0, 6);

  const decreasedProducts = [...products]
    .filter((product) => product.change.dir === "down")
    .sort((a, b) => Math.abs(b.change.pct) - Math.abs(a.change.pct))
    .slice(0, 6);

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <Hero />

      {error ? (
        <MarketDataNotice />
      ) : products.length === 0 ? (
        <MarketDataNotice empty />
      ) : (
        <>
          <section className="mb-12">
            <div className="mb-6 flex items-center gap-2">
              <span className="text-xl text-red-500">▲</span>
              <h2 className="text-2xl font-bold text-gray-900">আজ দাম বেড়েছে</h2>
            </div>
            {increasedProducts.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {increasedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <p className="text-gray-600">আজ কোনো পণ্যের দাম বাড়েনি।</p>
            )}
          </section>

          <section className="mb-12">
            <div className="mb-6 flex items-center gap-2">
              <span className="text-xl text-green-600">▼</span>
              <h2 className="text-2xl font-bold text-gray-900">আজ দাম কমেছে</h2>
            </div>
            {decreasedProducts.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {decreasedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <p className="text-gray-600">আজ কোনো পণ্যের দাম কমেনি।</p>
            )}
          </section>

          <section id="all-products" className="scroll-mt-32">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">সব পণ্য</h2>
              <p className="mt-1 text-sm text-gray-500">সবগুলো পণ্যের আজকের দাম</p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
