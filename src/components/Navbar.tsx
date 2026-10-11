import Link from "next/link";
import Image from "next/image";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import SignOutButton from "@/components/SignOutButton";
import NavbarAvatar from "@/components/NavbarAvatar";
import CategoryLinks from "@/components/CategoryLinks";
import { apiUrls } from "@/lib/api";

interface CategoryItem {
  id: number;
  slug: string;
  nameBn: string;
  icon: string;
}

interface ProductItem {
  id: number;
  categoryIcon: string;
  nameBn: string;
  today: number;
  unit: string;
  change: {
    dir: "up" | "down" | "flat";
    pct: number;
  };
}

async function getCategories(): Promise<CategoryItem[]> {
  const res = await fetch(apiUrls.categories);
  if (!res.ok) return [];
  return (await res.json()) as CategoryItem[];
}

async function getProducts(): Promise<ProductItem[]> {
  const res = await fetch(apiUrls.products);
  if (!res.ok) return [];
  return (await res.json()) as ProductItem[];
}

export default async function Navbar() {
  const categories = await getCategories();
  const products = await getProducts();

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const today = new Date();
  const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "long", year: "numeric" };
  const banglaDate = new Intl.DateTimeFormat("bn-BD", options).format(today);

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto max-w-6xl px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-y-4 gap-x-4">
          <div className="flex items-center gap-3 order-1">
            <div className="w-10 h-10 bg-green-600 rounded-md flex items-center justify-center text-white text-xl">
              <Image src="/logo-icon.png" alt="logo" width={24} height={24} className="brightness-0 invert" />
            </div>
            <div>
              <Link href="/" className="text-xl font-bold text-gray-900">
                বাজার দর
              </Link>
              <p className="text-xs text-gray-500">আজকের: {banglaDate}</p>
            </div>
          </div>

          <nav className="w-full md:w-auto flex-1 overflow-x-auto no-scrollbar order-3 md:order-2">
            <CategoryLinks categories={categories} />
          </nav>

          <div className="flex items-center gap-2 order-2 md:order-3">
            {session ? (
              <>
                <NavbarAvatar name={session.user.name} />
                <SignOutButton />
              </>
            ) : (
              <>
                <Link href="/signin" className="btn btn-ghost btn-sm font-semibold text-gray-700">
                  সাইন ইন
                </Link>
                <Link href="/signup" className="btn btn-primary btn-sm px-6 bg-green-600 hover:bg-green-700 border-none text-white">
                  সাইন আপ
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="bg-green-50 border-t border-b border-green-100 overflow-hidden py-2">
        <div className="flex animate-[marquee_40s_linear_infinite] whitespace-nowrap">
          {products.slice(0, 15).map((product) => (
            <div key={product.id} className="inline-flex items-center gap-2 mx-4 text-sm font-medium">
              <span>{product.categoryIcon}</span>
              <span className="text-gray-700">{product.nameBn}</span>
              <span className="text-gray-500">{product.today} টাকা/{product.unit === "kg" ? "কেজি" : product.unit}</span>
              {product.change.dir === "up" && <span className="text-red-500">▲ {product.change.pct}%</span>}
              {product.change.dir === "down" && <span className="text-green-600">▼ {Math.abs(product.change.pct)}%</span>}
              {product.change.dir === "flat" && <span className="text-gray-400">—</span>}
            </div>
          ))}
          {products.slice(0, 15).map((product) => (
            <div key={`${product.id}-dup`} className="inline-flex items-center gap-2 mx-4 text-sm font-medium">
              <span>{product.categoryIcon}</span>
              <span className="text-gray-700">{product.nameBn}</span>
              <span className="text-gray-500">{product.today} টাকা/{product.unit === "kg" ? "কেজি" : product.unit}</span>
              {product.change.dir === "up" && <span className="text-red-500">▲ {product.change.pct}%</span>}
              {product.change.dir === "down" && <span className="text-green-600">▼ {Math.abs(product.change.pct)}%</span>}
              {product.change.dir === "flat" && <span className="text-gray-400">—</span>}
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
