"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import NeubrutalButton from "@/components/interactive-button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
      const res = await fetch(`${backendUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.msg || "Login failed");
      }

      // Store JWT token and user info
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect to dashboard
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#FFF9E6] px-container-margin py-12">
      <div className="w-full max-w-md bg-white border-[3px] border-on-surface p-8 neubrutal-shadow rounded-xl">
        <div className="text-center mb-8">
          <Link
            href="/"
            className="font-display text-headline-lg font-black italic tracking-tighter text-on-surface uppercase block mb-2"
          >
            Kaami
          </Link>
          <p className="font-body-md text-on-surface-variant font-medium">
            Welcome back, builder! Log in to your ledger.
          </p>
        </div>

        {error && (
          <div className="bg-error-container text-on-error-container border-[2px] border-on-surface p-4 rounded-lg font-bold mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">error</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block font-label-caps text-label-caps text-on-surface-variant uppercase mb-2"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@rivers.com"
              className="w-full border-[3px] border-on-surface p-3 bg-surface-container-low font-body-md focus:outline-none focus:bg-white transition-all rounded-lg"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block font-label-caps text-label-caps text-on-surface-variant uppercase mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border-[3px] border-on-surface p-3 bg-surface-container-low font-body-md focus:outline-none focus:bg-white transition-all rounded-lg"
              required
            />
          </div>

          <NeubrutalButton
            type="submit"
            className="w-full py-4 bg-primary-container text-on-primary-container font-headline-md text-headline-md text-center uppercase tracking-wider block"
            shadowSize="sm"
            disabled={loading}
          >
            {loading ? "Logging In..." : "Log In"}
          </NeubrutalButton>
        </form>

        <div className="mt-8 pt-6 border-t-2 border-on-surface text-center">
          <p className="font-body-md text-on-surface-variant">
            New to Kaami?{" "}
            <Link
              href="/register"
              className="text-primary font-bold hover:underline"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
