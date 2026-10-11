import { notFound } from "next/navigation";
import { connection } from "next/server";
import MarketDataNotice from "@/components/MarketDataNotice";
import CategoryClient from "./CategoryClient";
import { getCategories, getProducts } from "@/lib/market-data";

export const instant = false;

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  await connection();

  const [categoryData, productData] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  if (categoryData.error || productData.error) {
    return (
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <MarketDataNotice />
      </div>
    );
  }

  const category = categoryData.items.find((item) => item.slug === slug);
  if (!category) {
    notFound();
  }

  const products = productData.items.filter((product) => product.category === slug);

  return <CategoryClient initialProducts={products} category={category} />;
}
