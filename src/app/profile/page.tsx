"use client";

import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [name, setName] = useState(() => session?.user?.name ?? "");
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(() => {
    if (typeof window === "undefined") {
      return null;
    }

    return window.localStorage.getItem("profileImage") ?? null;
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpdate = async () => {
    setLoading(true);
    const { error } = await authClient.updateUser({
      name,
    });
    setLoading(false);
    
    if (error) {
      toast.error(error.message || "আপডেট ব্যর্থ হয়েছে");
    } else {
      toast.success("তথ্য সফলভাবে আপডেট হয়েছে");
      router.refresh(); // Refresh in case the layout needs it
    }
  };

  const handleSignOut = async () => {
    await authClient.signOut();
    toast.success("সফলভাবে সাইন আউট হয়েছেন");
    router.push("/");
    router.refresh();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProfileImage(base64String);
        localStorage.setItem('profileImage', base64String);
        toast.success("ছবি সফলভাবে আপলোড হয়েছে!");
      };
      reader.readAsDataURL(file);
    }
  };

  if (isPending) return <div className="flex-1 flex justify-center py-20"><span className="loading loading-spinner loading-lg text-green-600"></span></div>;
  if (!session) return <div className="flex-1 flex justify-center py-20"><p className="text-gray-500">অনুগ্রহ করে লগইন করুন</p></div>;

  return (
    <div className="bg-[#f2f4f2] min-h-screen py-10 px-4">
      <div className="container mx-auto max-w-3xl">
        
        {/* Header Text */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">আমার প্রোফাইল</h1>
          <p className="text-gray-500">আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।</p>
        </div>

        {/* Top User Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            
            <div 
              className="relative w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex items-center justify-center cursor-pointer group border border-gray-200"
              onClick={() => fileInputRef.current?.click()}
            >
              {profileImage ? (
                <Image src={profileImage} alt="Profile" width={80} height={80} className="w-full h-full object-cover" unoptimized />
              ) : (
                <span className="text-gray-400 text-3xl font-bold">
                  {session.user.name?.charAt(0) || 'U'}
                </span>
              )}
              
              {/* Overlay for image upload */}
              <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              onChange={handleImageChange} 
              className="hidden" 
            />

            <div>
              <h2 className="text-xl font-bold text-gray-900">{session.user.name}</h2>
              <p className="text-gray-500">{session.user.email}</p>
            </div>
          </div>
          
          <button 
            onClick={handleSignOut} 
            className="btn btn-outline border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 hover:border-red-300 rounded-lg px-6 w-full md:w-auto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            সাইন আউট
          </button>
        </div>

        {/* Bottom Details Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">তথ্য</h3>
          
          <div className="space-y-6">
            <div className="form-control">
              <label className="label pt-0">
                <span className="label-text font-semibold text-gray-700">নাম</span>
              </label>
              <input
                type="text"
                value={name || session.user.name || ""}
                onChange={(e) => setName(e.target.value)}
                className="input input-bordered w-full focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 bg-white"
              />
            </div>
            
            <button 
              onClick={handleUpdate} 
              className="btn w-full bg-[#1a8b44] hover:bg-green-700 text-white border-none mt-2" 
              disabled={loading}
            >
              {loading ? <span className="loading loading-spinner"></span> : 'আপডেট'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
