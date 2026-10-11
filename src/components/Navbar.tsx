import Link from "next/link";
import Image from "next/image";
import { connection } from "next/server";
import { getAuthSession } from "@/lib/auth-session";
import SignOutButton from "@/components/SignOutButton";
import NavbarAvatar from "@/components/NavbarAvatar";
import CategoryLinks from "@/components/CategoryLinks";
import { getCategories, getProducts, unitLabels } from "@/lib/market-data";

export default async function Navbar() {
  await connection();

  const [categoryData, productData] = await Promise.all([
    getCategories(),
    getProducts(),
  ]);

  let session: Awaited<ReturnType<typeof getAuthSession>> = null;
  let authUnavailable = false;
  try {
    session = await getAuthSession();
  } catch (error) {
    authUnavailable = true;
    console.error("Unable to load the Better Auth session for the navbar", error);
  }

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
            {categoryData.error ? (
              <p className="text-sm text-amber-800" role="alert">
                ক্যাটাগরির তথ্য লোড করা যায়নি।
              </p>
            ) : (
              <CategoryLinks categories={categoryData.items} />
            )}
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
        {authUnavailable && (
          <p className="mt-2 text-right text-xs text-amber-800" role="status">
            সাইন ইন সুবিধা সাময়িকভাবে অনুপলব্ধ।
          </p>
        )}
      </div>

      <div className="bg-green-50 border-t border-b border-green-100 overflow-hidden py-2">
        <div className="flex animate-marquee whitespace-nowrap">
          {productData.items.slice(0, 15).map((product) => (
            <div key={product.id} className="inline-flex items-center gap-2 mx-4 text-sm font-medium">
              <span>{product.categoryIcon}</span>
              <span className="text-gray-700">{product.nameBn}</span>
              <span className="text-gray-500">{product.today} টাকা/{unitLabels[product.unit] || product.unit}</span>
              {product.change.dir === "up" && <span className="text-red-500">▲ {product.change.pct}%</span>}
              {product.change.dir === "down" && <span className="text-green-600">▼ {Math.abs(product.change.pct)}%</span>}
              {product.change.dir === "flat" && <span className="text-gray-400">—</span>}
            </div>
          ))}
          {productData.items.slice(0, 15).map((product) => (
            <div key={`${product.id}-dup`} className="inline-flex items-center gap-2 mx-4 text-sm font-medium">
              <span>{product.categoryIcon}</span>
              <span className="text-gray-700">{product.nameBn}</span>
              <span className="text-gray-500">{product.today} টাকা/{unitLabels[product.unit] || product.unit}</span>
              {product.change.dir === "up" && <span className="text-red-500">▲ {product.change.pct}%</span>}
              {product.change.dir === "down" && <span className="text-green-600">▼ {Math.abs(product.change.pct)}%</span>}
              {product.change.dir === "flat" && <span className="text-gray-400">—</span>}
            </div>
          ))}
          {productData.error && (
            <p className="mx-4 text-sm text-amber-800" role="alert">
              পণ্যের তথ্য লোড করা যায়নি।
            </p>
          )}
          {!productData.error && productData.items.length === 0 && (
            <p className="mx-4 text-sm text-gray-600">বর্তমানে পণ্যের তথ্য নেই।</p>
          )}
        </div>
      </div>
    </header>
  );
}
