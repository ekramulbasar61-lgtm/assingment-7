"use client";

import Link from "next/link";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { authErrorMessage } from "@/lib/auth-error-message";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const googleAuthEnabled = Boolean(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);
  const githubAuthEnabled = Boolean(process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID);
  const hasSocialAuth = googleAuthEnabled || githubAuthEnabled;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError("");
    setLoading(true);

    try {
      const { error } = await authClient.signIn.email({ email, password });
      if (error) {
        console.error("Better Auth email sign-in failed", error);
        setFormError(authErrorMessage(error, "sign-in"));
        return;
      }

      toast.success("সফলভাবে লগইন হয়েছে!");
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Better Auth email sign-in request failed", error);
      setFormError("লগইন সেবা এখন পাওয়া যাচ্ছে না। কিছুক্ষণ পর আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    try {
      const result = await authClient.signIn.social({
        provider,
        callbackURL: "/",
      });

      if (result?.error) {
        console.error(`Better Auth ${provider} sign-in failed`, result.error);
        setFormError("সামাজিক মাধ্যমে লগইন করা যায়নি। আবার চেষ্টা করুন।");
        return;
      }

      toast.success(`${provider} দিয়ে লগইন করা হচ্ছে...`);
    } catch (error) {
      console.error(`Better Auth ${provider} sign-in request failed`, error);
      setFormError("সামাজিক মাধ্যমে লগইন সেবা এখন পাওয়া যাচ্ছে না।");
    }
  };

  return (
    <div className="flex justify-center items-center py-16 px-4 bg-gray-50 flex-1">
      <div className="card w-full max-w-md bg-white shadow-xl border border-gray-100">
        <div className="card-body">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">স্বাগতম ফিরে এসেছেন</h2>
            <p className="text-gray-500 text-sm">আপনার অ্যাকাউন্টে সাইন ইন করুন</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-gray-700">ইমেইল</span>
              </label>
              <input 
                type="email" 
                placeholder="আপনার ইমেইল দিন" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="input input-bordered w-full focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 bg-white" 
                required 
              />
            </div>
            
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium text-gray-700">পাসওয়ার্ড</span>
              </label>
              <input 
                type="password" 
                placeholder="আপনার পাসওয়ার্ড দিন" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="input input-bordered w-full focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 bg-white" 
                required 
              />
            </div>

            {formError && (
              <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">
                {formError}
              </p>
            )}

            <button type="submit" className="btn w-full bg-green-600 hover:bg-green-700 text-white border-none mt-2" disabled={loading}>
              {loading ? <span className="loading loading-spinner"></span> : 'লগইন করুন'}
            </button>
          </form>

          {hasSocialAuth && (
            <div className="divider text-gray-400 text-sm my-6">অথবা</div>
          )}

          {hasSocialAuth && (
            <div className="flex flex-col gap-3">
              {googleAuthEnabled && (
            <button onClick={() => handleSocialLogin('google')} className="btn btn-outline border-gray-300 hover:bg-gray-50 hover:text-gray-900 w-full bg-white">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5 mr-2">
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
              </svg>
              Google দিয়ে লগইন
            </button>
              )}
              {githubAuthEnabled && (
            <button onClick={() => handleSocialLogin('github')} className="btn btn-outline border-gray-300 hover:bg-gray-50 hover:text-gray-900 w-full bg-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 mr-2"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
              GitHub দিয়ে লগইন
            </button>
              )}
            </div>
          )}

          <p className="text-center text-sm text-gray-600 mt-6">
            অ্যাকাউন্ট নেই? <Link href="/signup" className="text-green-600 font-semibold hover:underline">সাইন আপ করুন</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
