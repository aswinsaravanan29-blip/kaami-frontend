"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import NeubrutalButton from "@/components/interactive-button";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (token && storedUser) {
      setIsLoggedIn(true);
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user from localStorage", e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <main className="relative min-h-screen selection:bg-tertiary-fixed selection:text-on-tertiary-fixed overflow-x-hidden">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 bg-surface border-b-[3px] border-on-surface flex justify-between items-center w-full px-container-margin py-4 max-w-full">
        <div className="flex items-center gap-8">
          <Link
            className="font-headline-md text-headline-md font-black italic tracking-tighter text-on-surface uppercase"
            href="#"
          >
            Kaami
          </Link>
          <div className="hidden md:flex gap-6 items-center">
            {isLoggedIn ? (
              <>
                <Link
                  className="font-label-caps text-label-caps text-primary font-bold border-b-2 border-primary pb-1"
                  href="/dashboard"
                >
                  Dashboard
                </Link>
                <Link
                  className="font-label-caps text-label-caps text-on-surface-variant font-medium hover:text-primary transition-colors"
                  href="/dashboard"
                >
                  Verifications
                </Link>
                <Link
                  className="font-label-caps text-label-caps text-on-surface-variant font-medium hover:text-primary transition-colors"
                  href="#network"
                >
                  Network
                </Link>
              </>
            ) : (
              <>
                <Link
                  className="font-label-caps text-label-caps text-primary font-bold border-b-2 border-primary pb-1"
                  href="#features"
                >
                  Features
                </Link>
                <Link
                  className="font-label-caps text-label-caps text-on-surface-variant font-medium hover:text-primary transition-colors"
                  href="#testimonials"
                >
                  Testimonials
                </Link>
                <Link
                  className="font-label-caps text-label-caps text-on-surface-variant font-medium hover:text-primary transition-colors"
                  href="#network"
                >
                  Network
                </Link>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <span className="hidden sm:inline font-label-caps text-[14px] text-on-surface-variant font-bold bg-white border-[2px] border-on-surface px-3 py-1">
                Hi, {user?.name || "Builder"}
              </span>
              <NeubrutalButton
                type="button"
                onClick={handleLogout}
                className="font-button-text text-button-text px-6 py-2 bg-secondary-container text-on-secondary-container"
                shadowSize="sm"
              >
                Log Out
              </NeubrutalButton>
            </>
          ) : (
            <>
              <Link href="/login" className="hidden sm:block">
                <NeubrutalButton
                  type="button"
                  className="font-button-text text-button-text px-6 py-2 bg-secondary-container text-on-secondary-container"
                  shadowSize="sm"
                >
                  Log In
                </NeubrutalButton>
              </Link>
              <Link href="/register">
                <NeubrutalButton
                  type="button"
                  className="font-button-text text-button-text px-6 py-2 bg-primary-container text-on-primary-container"
                  shadowSize="sm"
                >
                  Get Started
                </NeubrutalButton>
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-container-margin pt-16 pb-24 md:pt-32 md:pb-40 overflow-hidden">
        {/* Decorative Hand-drawn Elements shifted to card */}

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-block px-4 py-1 bg-tertiary-fixed border-[2px] border-on-surface rounded-full mb-6 font-label-caps text-label-caps uppercase select-none">
              Rated 5{" "}
              <span
                className="material-symbols-outlined align-middle text-[14px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                star
              </span>{" "}
              on ProofHub →
            </div>
            <h1 className="font-display text-headline-lg md:text-display mb-8 text-on-surface">
              Don't tell people what you did.{" "}
              <span className="scribble-underline">Prove it.</span>
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mb-10">
              Kaami is the ultimate ledger for builders. UNLIMITED
              verifications, real-time endorsements, and 100% verified
              credentials for FREE. No more fake resumes.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              {isLoggedIn ? (
                <Link href="/dashboard" className="w-full sm:w-auto">
                  <NeubrutalButton
                    className="w-full px-8 py-4 bg-primary-container text-on-primary-container font-headline-md text-headline-md text-center"
                    shadowSize="md"
                  >
                    Go to Dashboard
                  </NeubrutalButton>
                </Link>
              ) : (
                <Link href="/register" className="w-full sm:w-auto">
                  <NeubrutalButton
                    className="w-full px-8 py-4 bg-primary-container text-on-primary-container font-headline-md text-headline-md text-center"
                    shadowSize="md"
                  >
                    Create free account
                  </NeubrutalButton>
                </Link>
              )}
            </div>
            <div className="mt-8 flex flex-col gap-2 font-label-caps text-[14px]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary font-bold">
                  check_circle
                </span>
                <span>Unlimited verifications</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary font-bold">
                  check_circle
                </span>
                <span>No credit card required</span>
              </div>
            </div>
          </div>

          <div className="relative">
            {/* Decorative Hand-drawn Elements */}
            {!isLoggedIn && (
              <div className="absolute -top-[90px] -right-[30px] hidden lg:block floating-arrow select-none pointer-events-none z-10">
                <svg
                  fill="none"
                  height="130"
                  viewBox="-20 0 145 130"
                  width="145"
                  xmlns="http://www.w3.org/2000/svg"
                >
                <path
                  d="M10 110C30 90 40 40 100 20M100 20L80 15M100 20L105 40"
                  stroke="#AB3500"
                  strokeLinecap="round"
                  strokeWidth="4"
                ></path>
                {/* <text
                  fill="#AB3500"
                  fontFamily="Space Mono"
                  fontWeight="bold"
                  transform="rotate(-15 10 110)"
                  x="15"
                  y="115"
                >
                  TRUSTED
                </text> */}
              </svg>
            </div>
            )}
            {/* Featured Bento Demo Card */}
            <div className="bg-surface-container-lowest border-[3px] border-on-surface p-4 sm:p-8 neubrutal-shadow rounded-xl">
              <div className="flex items-center justify-between mb-8">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-error"></div>
                  <div className="w-3 h-3 rounded-full bg-tertiary"></div>
                  <div className="w-3 h-3 rounded-full bg-secondary"></div>
                </div>
                <span className="font-label-caps text-label-caps bg-surface-variant px-3 py-1 border-[2px] border-on-surface select-none">
                  builder_profile_v2.exe
                </span>
              </div>
              <div className="space-y-6">
                <div className="p-4 sm:p-6 bg-secondary-container border-[3px] border-on-surface neubrutal-shadow-sm rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-[2px] border-on-surface bg-surface overflow-hidden relative">
                      <Image
                        className="w-full h-full object-cover"
                        alt="A stylized neubrutalist portrait of a young male software engineer"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxi626LgUUQMd6Sp9ZNauiaOnKpfcUPA5GewK3BxYEsnlSZ_EJQas04bO4TYPlK-jd70Yuk2zADdaIAKfZCxWC36UBgEBfQwDV0rLUN_3WVd61l_YgijtJMOHNZLXAo3gLkvcCDIfNXLwojAA0AcyBgpVyHwMhEx_C9r4Lg4nYjpUSpekkweydBzr7DQ7XsaC9QMkAiQlcHCyW-1BtH3EugzIJq6Pr9LA6hivaD6dr9kz9d0CQyVSpO-h_o4OelFWwJ2X1yAmF0eNu"
                        width={48}
                        height={48}
                        priority
                      />
                    </div>
                    <div>
                      <div className="font-headline-md text-[18px]">
                        Alex Rivers
                      </div>
                      <div className="font-label-caps text-[10px] text-on-secondary-container">
                        SENIOR FULLSTACK
                      </div>
                    </div>
                  </div>
                  <span
                    className="material-symbols-outlined text-secondary"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    verified
                  </span>
                </div>
                <div className="bg-white border-[3px] border-on-surface p-4">
                  <div className="font-label-caps text-[12px] mb-2 uppercase text-on-surface-variant">
                    Latest Proof
                  </div>
                  <div className="font-headline-md text-headline-md mb-4">
                    Shipped v2.0 of Core API
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-tertiary-fixed border-[2px] border-on-surface text-[12px] font-bold">
                      Rust
                    </span>
                    <span className="px-2 py-1 bg-secondary-fixed border-[2px] border-on-surface text-[12px] font-bold">
                      AWS
                    </span>
                  </div>
                </div>
                <NeubrutalButton
                  className="w-full py-4 bg-tertiary-fixed-dim text-on-tertiary-container font-button-text text-button-text uppercase tracking-widest text-center"
                  shadowSize="sm"
                >
                  Endorse Alex
                </NeubrutalButton>
              </div>
            </div>
            {/* Floating Badge */}
            <div className="absolute -bottom-6 -left-6 bg-primary-container text-on-primary-container border-[3px] border-on-surface p-4 neubrutal-shadow rounded-lg -rotate-6 hidden sm:block">
              <div className="font-headline-md text-headline-md">99%</div>
              <div className="font-label-caps text-[10px]">VERIFIED TRUST</div>
            </div>
          </div>
        </div>
      </section>

      {/* Ticker Separator */}
      <div className="relative w-full h-24 overflow-hidden bg-tertiary-fixed border-y-[3px] border-on-surface">
        <div className="absolute top-0 w-full curved-line opacity-20"></div>
        <div className="absolute inset-0 flex items-center justify-center font-label-caps text-headline-md tracking-widest text-on-tertiary-fixed uppercase font-black py-4 select-none whitespace-nowrap overflow-hidden">
          Prove Your Potential • Build Your Legacy • Own Your Career
        </div>
      </div>

      {/* Features Bento Grid */}
      <section id="features" className="bg-secondary px-container-margin py-24 border-b-[3px] border-on-surface">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="font-label-caps text-headline-md text-on-secondary-fixed mb-4">
              HOW IT WORKS
            </div>
            <h2 className="font-display text-headline-lg md:text-display text-white mb-6">
              Built for high-stakes builders
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-bento-gap">
            {/* Feature Card 1 */}
            <div className="md:col-span-8 bg-surface border-[3px] border-on-surface p-8 neubrutal-shadow rounded-xl hover:-translate-y-1 transition-transform duration-250">
              <div className="flex flex-col md:flex-row gap-10 items-center">
                <div className="flex-1">
                  <span className="material-symbols-outlined text-[48px] text-primary mb-6">
                    shield_with_heart
                  </span>
                  <h3 className="font-headline-lg text-headline-lg mb-4 italic">
                    Immutable Verification
                  </h3>
                  <p className="font-body-lg text-body-lg text-on-surface-variant">
                    Every submission is cryptographically signed and verified by
                    our network of peers. Once it's on your profile, it's there
                    forever.
                  </p>
                </div>
                <div className="w-full md:w-64 aspect-square bg-secondary-fixed border-[3px] border-on-surface neubrutal-shadow-sm flex items-center justify-center">
                  <span
                    className="material-symbols-outlined text-[80px] text-on-secondary-fixed-variant"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    security
                  </span>
                </div>
              </div>
            </div>

            {/* Feature Card 2 */}
            <div className="md:col-span-4 bg-tertiary-fixed border-[3px] border-on-surface p-8 neubrutal-shadow rounded-xl hover:-translate-y-1 transition-transform duration-250">
              <span className="material-symbols-outlined text-[48px] text-on-tertiary-fixed mb-6">
                workspace_premium
              </span>
              <h3 className="font-headline-md text-headline-md mb-4 uppercase">
                Badge Engine
              </h3>
              <p className="font-body-md text-body-md text-on-tertiary-fixed-variant">
                Earn soul-bound tokens for major releases, open-source
                contributions, and mentorship milestones.
              </p>
            </div>

            {/* Feature Card 3 */}
            <div className="md:col-span-4 bg-primary-fixed border-[3px] border-on-surface p-8 neubrutal-shadow rounded-xl hover:-translate-y-1 transition-transform duration-250">
              <span className="material-symbols-outlined text-[48px] text-on-primary-fixed mb-6">
                share_location
              </span>
              <h3 className="font-headline-md text-headline-md mb-4 uppercase">
                Global Reach
              </h3>
              <p className="font-body-md text-body-md text-on-primary-fixed-variant">
                Share your verified work link anywhere. Recruiters can verify
                your claims in one click without even signing up.
              </p>
            </div>

            {/* Feature Card 4 */}
            <div className="md:col-span-8 bg-surface-container-highest border-[3px] border-on-surface p-8 neubrutal-shadow rounded-xl hover:-translate-y-1 transition-transform duration-250 overflow-hidden relative">
              <div className="flex flex-col md:flex-row gap-10 items-center relative z-10">
                <div className="flex-1">
                  <h3 className="font-headline-lg text-headline-lg mb-4">
                    Zero-Clutter Network
                  </h3>
                  <p className="font-body-lg text-body-lg text-on-surface-variant mb-6">
                    No "congrats on the new role" spam. Just high-density proof
                    of production. Focus on the craft, not the noise.
                  </p>
                  <NeubrutalButton
                    className="px-6 py-2 bg-on-surface text-surface font-button-text uppercase"
                    shadowSize="sm"
                  >
                    Explore Network
                  </NeubrutalButton>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="w-20 h-20 bg-secondary-container border-[3px] border-on-surface rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined">code</span>
                  </div>
                  <div className="w-20 h-20 bg-tertiary-container border-[3px] border-on-surface rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined">terminal</span>
                  </div>
                  <div className="w-20 h-20 bg-primary-container border-[3px] border-on-surface rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined">database</span>
                  </div>
                  <div className="w-20 h-20 bg-inverse-primary border-[3px] border-on-surface rounded-full flex items-center justify-center">
                    <span className="material-symbols-outlined">api</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof & Testimonials Section */}
      <section id="testimonials" className="bg-surface px-container-margin py-24 overflow-hidden relative">
        <div id="network" className="max-w-7xl mx-auto text-center">
          <div className="font-label-caps text-label-caps text-on-surface-variant mb-12 uppercase tracking-[0.2em]">
            Trusted by teams all over the world
          </div>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-60 grayscale hover:grayscale-0 transition-all select-none font-bold">
            <div className="font-headline-lg text-headline-lg font-black tracking-tighter">
              GITHUUB
            </div>
            <div className="font-headline-lg text-headline-lg font-black tracking-tighter">
              STACKOVERFLOWED
            </div>
            <div className="font-headline-lg text-headline-lg font-black tracking-tighter">
              STRYPE
            </div>
            <div className="font-headline-lg text-headline-lg font-black tracking-tighter">
              FIGMUH
            </div>
          </div>

          {/* Testimonial */}
          <div className="mt-32 max-w-4xl mx-auto relative">
            <div className="absolute -top-10 -left-10 text-[100px] text-tertiary-fixed-dim leading-none opacity-50 select-none font-black italic">
              "
            </div>
            <div className="bg-surface-container-low border-[3px] border-on-surface p-6 md:p-12 neubrutal-shadow relative z-10">
              <p className="font-headline-md text-[28px] md:text-[36px] italic mb-8 leading-tight text-center">
                "Kaami is an absolute joy to use. It finally gives
                technical leaders a way to see what developers can actually DO
                instead of just what they say they did on a resume."
              </p>
              <div className="flex items-center justify-center gap-4">
                <div className="w-16 h-16 rounded-full border-[3px] border-on-surface overflow-hidden relative">
                  <Image
                    className="w-full h-full object-cover"
                    alt="Sarah Jenkins headshot"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCgk1fJTWEb9ycqUcAt07RJsvumzY9uUaQEBpQYVqIOSluXTGKJIUp7ugivOsNjFuXNCgTH7EW8bCzqDX3PO2TA-8Egyso6FdWH2caN3ScGUWhH3bRu4h8s8OJl7eRAx8zu4-v6XK5y2MX_L4FiRvz73VY-ZPWqx0ScD1Ddwa3bjO73RU4T28NrFvm09VO1nDs9ZZfXOYb-kL-Gmhks55SnUwEeRpuFUZxCDI8G9C8dLCf5mjjDKkZi8_kHD27xlyUGFfUlI4cTQ-lW"
                    width={64}
                    height={64}
                  />
                </div>
                <div className="text-left">
                  <div className="font-headline-md text-headline-md">
                    Sarah Jenkins
                  </div>
                  <div className="font-label-caps text-[12px] text-on-surface-variant uppercase">
                    Engineering Director @ TechFlow
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-10 -right-10 text-[100px] text-primary-fixed leading-none opacity-50 select-none font-black italic rotate-180">
              "
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-primary-container px-container-margin py-32 border-t-[3px] border-on-surface text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-display text-headline-lg md:text-display text-on-primary-container mb-12">
            Stop talking. Start proving.
          </h2>
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <NeubrutalButton
              className="w-full md:w-auto px-10 py-5 bg-surface text-on-surface font-headline-md text-headline-md uppercase text-center"
              shadowSize="md"
            >
              Get Started for Free
            </NeubrutalButton>
            <NeubrutalButton
              className="w-full md:w-auto px-10 py-5 bg-tertiary text-white font-headline-md text-headline-md uppercase text-center"
              shadowSize="md"
            >
              Book a Demo
            </NeubrutalButton>
          </div>
          <p className="mt-12 font-label-caps text-on-primary-container opacity-80 uppercase tracking-widest">
            Join 100,000+ builders already proving their work
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-12 px-container-margin flex flex-col md:flex-row justify-between items-center gap-gutter bg-surface-container-highest border-t-[3px] border-on-surface">
        <div className="flex flex-col items-center md:items-start gap-4">
          <div className="font-headline-md text-headline-md font-black text-primary uppercase italic tracking-tighter">
            Kaami
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-xs text-center md:text-left">
            © 2024 Kaami. Built for builders. No fluff, just proof.
          </p>
        </div>
        <div className="flex flex-col items-center md:items-end gap-6">
          <div className="flex flex-wrap justify-center gap-8">
            <Link
              className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors"
              href="#"
            >
              Terms
            </Link>
            <Link
              className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors"
              href="#"
            >
              Privacy
            </Link>
            <Link
              className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors"
              href="#"
            >
              Support
            </Link>
            <Link
              className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors"
              href="#"
            >
              API
            </Link>
          </div>
          <div className="flex gap-4">
            <NeubrutalButton
              className="w-10 h-10 bg-on-surface text-surface flex items-center justify-center p-0"
              shadowSize="sm"
            >
              <span className="material-symbols-outlined text-[20px]">
                public
              </span>
            </NeubrutalButton>
            <NeubrutalButton
              className="w-10 h-10 bg-on-surface text-surface flex items-center justify-center p-0"
              shadowSize="sm"
            >
              <span className="material-symbols-outlined text-[20px]">
                alternate_email
              </span>
            </NeubrutalButton>
            <NeubrutalButton
              className="w-10 h-10 bg-on-surface text-surface flex items-center justify-center p-0"
              shadowSize="sm"
            >
              <span className="material-symbols-outlined text-[20px]">
                rss_feed
              </span>
            </NeubrutalButton>
          </div>
        </div>
      </footer>

      {/* Floating Action Button (FAB) */}
      <div className="fixed bottom-8 right-8 z-50">
        <NeubrutalButton
          className="w-16 h-16 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center p-0 group"
          shadowSize="md"
        >
          <span className="material-symbols-outlined text-[32px] group-hover:rotate-12 transition-transform">
            add_task
          </span>
        </NeubrutalButton>
      </div>
    </main>
  );
}
