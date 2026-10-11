import { notFound } from "next/navigation";
import { apiUrls } from "@/lib/api";
import CategoryClient from "./CategoryClient";

interface Category {
  id: number;
  slug: string;
  nameBn: string;
  icon: string;
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
  change: {
    dir: string;
    pct: number;
  };
}

async function getCategory(slug: string): Promise<Category | null> {
  const res = await fetch(apiUrls.categories);
  if (!res.ok) return null;
  const categories: Category[] = await res.json();
  return categories.find(c => c.slug === slug) || null;
}

async function getProductsByCategory(slug: string): Promise<Product[]> {
  const res = await fetch(apiUrls.products);
  if (!res.ok) return [];
  const products: Product[] = await res.json();
  return products.filter(p => p.category === slug);
}

export const instant = false;

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  
  const category = await getCategory(slug);
  
  if (!category) {
    notFound();
  }

  const products = await getProductsByCategory(slug);

  return <CategoryClient initialProducts={products} category={category} />;
}
