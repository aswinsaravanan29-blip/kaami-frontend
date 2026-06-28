"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import NeubrutalButton from "@/components/interactive-button";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [authTransition, setAuthTransition] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
      const res = await fetch(`${backendUrl}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.msg || "Registration failed");
      }

      // Store JWT token and user info
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect to dashboard with transition delay
      setAuthTransition("Generating cryptographic ledger node signature...");
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 950);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#FFF9E6] px-container-margin py-12 relative">
      <div className="w-full max-w-md bg-white border-[3px] border-on-surface p-8 neubrutal-shadow rounded-xl">
        <div className="text-center mb-8">
          <Link
            href="/"
            className="font-display text-headline-lg font-black italic tracking-tighter text-on-surface uppercase block mb-2"
          >
            Kaami
          </Link>
          <p className="font-body-md text-on-surface-variant font-medium">
            Create an account to start proving your worth.
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
              htmlFor="name"
              className="block font-label-caps text-label-caps text-on-surface-variant uppercase mb-2"
            >
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alex Rivers"
              className="w-full border-[3px] border-on-surface p-3 bg-surface-container-low font-body-md focus:outline-none focus:bg-white transition-all rounded-lg"
              required
            />
          </div>

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

          <div>
            <label
              htmlFor="confirmPassword"
              className="block font-label-caps text-label-caps text-on-surface-variant uppercase mb-2"
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border-[3px] border-on-surface p-3 bg-surface-container-low font-body-md focus:outline-none focus:bg-white transition-all rounded-lg"
              required
            />
          </div>

          <NeubrutalButton
            type="submit"
            className="w-full py-4 bg-primary-container text-on-primary-container font-button-text text-button-text uppercase tracking-widest text-center"
            shadowSize="sm"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </NeubrutalButton>
        </form>

        <div className="mt-8 pt-6 border-t-2 border-on-surface text-center">
          <p className="font-body-md text-on-surface-variant">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary font-bold hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>

      {/* Transition Overlay */}
      {authTransition && (
        <div className="fixed inset-0 bg-[#FFF9E6] border-[6px] border-on-surface z-[100] flex flex-col items-center justify-center animate-fade-in select-none">
          <div className="bg-white border-[3px] border-on-surface p-8 neubrutal-shadow rounded-xl flex flex-col items-center gap-6 max-w-xs text-center">
            <span className="material-symbols-outlined text-[64px] animate-spin text-primary font-bold">sync</span>
            <div>
              <h3 className="font-display text-xl font-black uppercase text-on-surface">Kaami OS</h3>
              <p className="font-mono text-xs text-on-surface-variant mt-2 font-bold">{authTransition}</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
