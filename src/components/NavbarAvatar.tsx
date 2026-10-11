"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";

export default function NavbarAvatar({ name }: { name: string }) {
  const [profileImage] = useState<string | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    return window.localStorage.getItem("profileImage") ?? null;
  });

  return (
    <Link href="/profile" className="flex items-center gap-2 mr-2 group">
      <div className="avatar placeholder">
        {profileImage ? (
          <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200">
            <Image src={profileImage} alt="Profile" width={32} height={32} className="w-full h-full object-cover" unoptimized />
          </div>
        ) : (
          <div className="bg-green-100 text-green-700 rounded-full w-8 h-8 flex items-center justify-center">
            <span className="text-sm font-semibold">{name?.charAt(0) || "U"}</span>
          </div>
        )}
      </div>
      <span className="text-sm font-semibold text-gray-700 hidden sm:block group-hover:text-green-600 transition-colors">{name}</span>
    </Link>
  );
}
