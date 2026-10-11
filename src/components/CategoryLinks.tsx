"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface CategoryItem {
  id: string | number;
  slug: string;
  nameBn: string;
  icon: string;
}

export default function CategoryLinks({ categories }: { categories: CategoryItem[] }) {
  const pathname = usePathname();

  return (
    <ul className="flex items-center md:justify-center gap-4 text-sm whitespace-nowrap">
      {categories.map((cat) => {
        const isActive = pathname === `/category/${cat.slug}`;

        return (
          <li key={cat.id}>
            <Link
              href={`/category/${cat.slug}`}
              className={`flex items-center gap-1 font-medium transition-colors pb-1 border-b-2 ${
                isActive
                  ? "text-green-600 border-green-600"
                  : "text-gray-600 border-transparent hover:text-green-600"
              }`}
            >
              <span>{cat.icon}</span> {cat.nameBn}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
