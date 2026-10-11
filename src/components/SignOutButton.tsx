"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function SignOutButton() {
  const router = useRouter();
  
  const handleSignOut = async () => {
    await authClient.signOut();
    toast.success("সফলভাবে সাইন আউট হয়েছেন");
    router.push("/");
    router.refresh();
  };

  return (
    <button onClick={handleSignOut} className="btn btn-ghost btn-sm font-semibold text-red-600 hover:bg-red-50">
      সাইন আউট
    </button>
  );
}
