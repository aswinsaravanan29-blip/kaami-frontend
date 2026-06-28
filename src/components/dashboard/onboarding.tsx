"use client";

import React, { useState, useEffect } from "react";
import NeubrutalButton from "../interactive-button";

interface OnboardingProps {
  onComplete: (data: { username: string; profession: string; theme: string; displayName: string }) => void;
  onSkip: () => void;
  baseUrl: string;
}

export default function Onboarding({ onComplete, onSkip, baseUrl }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [profession, setProfession] = useState("developer");
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [theme, setTheme] = useState("modern");

  // Read registered user info on mount to pre-populate name and username slug
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user");
      if (stored) {
        try {
          const u = JSON.parse(stored);
          if (u.name) {
            setDisplayName(u.name);
            setUsername(u.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-_]/g, ""));
          }
        } catch (e) {
          console.error("Failed to parse user session in onboarding", e);
        }
      }
    }
  }, []);

  // Check username availability in real-time against backend database
  useEffect(() => {
    if (username.length < 3) {
      setIsAvailable(false);
      return;
    }

    setIsChecking(true);
    const delayDebounceFn = setTimeout(async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
        const res = await fetch(`${backendUrl}/api/profile/check-username/${encodeURIComponent(username.toLowerCase())}`);
        if (res.ok) {
          const data = await res.json();
          setIsAvailable(data.available);
          if (!data.available && data.suggestion) {
            setUsername(data.suggestion);
          }
        } else {
          setIsAvailable(false);
        }
      } catch (e) {
        console.error(e);
        setIsAvailable(false);
      } finally {
        setIsChecking(false);
      }
    }, 450);

    return () => clearTimeout(delayDebounceFn);
  }, [username]);

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      onComplete({ username, profession, theme, displayName });
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const suggestions = [
    `${username.toLowerCase()}-dev`,
    `real-${username.toLowerCase()}`,
    `${username.toLowerCase()}-builder`,
    `proof-${username.toLowerCase()}`
  ];

  const professions = [
    { id: "developer", label: "Developer", icon: "code" },
    { id: "designer", label: "Designer", icon: "palette" },
    { id: "founder", label: "Founder", icon: "rocket_launch" },
    { id: "freelancer", label: "Freelancer", icon: "work" },
    { id: "student", label: "Student", icon: "school" },
    { id: "agency", label: "Agency Owner", icon: "corporate_fare" },
    { id: "marketer", label: "Marketer", icon: "campaign" },
    { id: "pm", label: "Product Manager", icon: "view_kanban" },
    { id: "other", label: "Other", icon: "more_horiz" },
  ];

  const themes = [
    { id: "minimal", label: "Minimal", desc: "Monochrome, high density grid", colors: "bg-white border-on-surface" },
    { id: "professional", label: "Professional", desc: "Corporate fonts, clean borders", colors: "bg-[#f8f9fa] border-slate-700" },
    { id: "modern", label: "Modern", desc: "Bold contrasts & dynamic spacing", colors: "bg-[#FFF9E6] border-on-surface" },
    { id: "creative", label: "Creative", desc: "Splashes of rust & teal panels", colors: "bg-secondary-container border-on-surface" },
    { id: "corporate", label: "Corporate", desc: "Subtle elevations & dark headers", colors: "bg-slate-900 text-white border-slate-900" },
  ];

  return (
    <div className="w-full max-w-4xl bg-white border-[3px] border-on-surface neubrutal-shadow rounded-xl overflow-hidden flex flex-col md:flex-row h-[90vh] md:h-[620px] max-h-[90vh] md:max-h-[620px] animate-scale-up">
      {/* Sidebar with step indicator */}
      <div className="hidden md:flex md:w-1/3 bg-[#FFF9E6] border-r-[3px] border-on-surface p-8 flex-col justify-between h-full shrink-0">
        <div>
          <span className="font-display text-headline-md font-black italic tracking-tighter text-on-surface uppercase block mb-6">
            Kaami Setup
          </span>
          <div className="space-y-4">
            {[
              "Welcome to Kaami",
              "Select Profession",
              "Reserve Identity",
              "Choose Theme",
              "Review Setup"
            ].map((name, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className={`w-7 h-7 rounded-full border-[2px] border-on-surface flex items-center justify-center font-mono text-[12px] font-bold ${
                    step === i + 1
                      ? "bg-primary-container text-on-primary-container"
                      : step > i + 1
                      ? "bg-secondary-container text-on-secondary-container"
                      : "bg-white"
                  }`}
                >
                  {step > i + 1 ? (
                    <span className="material-symbols-outlined text-[16px] font-bold">check</span>
                  ) : (
                    i + 1
                  )}
                </div>
                <span
                  className={`font-label-caps text-[12px] ${
                    step === i + 1 ? "font-black text-on-surface" : "font-bold text-on-surface-variant/60"
                  }`}
                >
                  {name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t-2 border-on-surface/20">
          <div className="font-label-caps text-[10px] text-on-surface-variant uppercase mb-1">
            Estimated time
          </div>
          <div className="font-mono text-[12px] font-bold text-primary flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] font-bold">schedule</span>
            2 - 3 minutes
          </div>
        </div>
      </div>

      {/* Main Form content */}
      <div className="flex-1 flex flex-col bg-surface h-full overflow-hidden">
        {/* PROGRESS INDICATOR TOP */}
        <div className="p-6 sm:p-8 pb-3 shrink-0 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="font-label-caps text-[10px] text-on-surface-variant font-bold bg-white border-[2px] border-on-surface px-2.5 py-0.5 rounded-full">
              Step {step} of 5
            </span>
            {step < 5 && (
              <button
                onClick={onSkip}
                className="font-label-caps text-[11px] text-on-surface-variant/80 hover:text-primary font-bold transition-colors cursor-pointer"
              >
                Skip setup →
              </button>
            )}
          </div>
          
          {/* Mobile Only: Progress Bar & Current Step Title */}
          <div className="block md:hidden">
            <div className="flex gap-1 h-2 bg-slate-100 border-[2px] border-on-surface rounded-full overflow-hidden">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`flex-1 h-full transition-all duration-300 ${
                    step >= i ? "bg-primary" : "bg-transparent"
                  }`}
                />
              ))}
            </div>
            <div className="font-mono text-[9px] text-on-surface-variant/70 mt-1 uppercase font-bold text-right">
              {[
                "Welcome to Kaami",
                "Choose Profession",
                "Reserve Identity",
                "Choose Theme",
                "Review Setup"
              ][step - 1]}
            </div>
          </div>
        </div>

        {/* STEP CONTENT SWITCHER */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-2 flex flex-col justify-center">
          {/* STEP 1: WELCOME */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="inline-block px-3 py-1 bg-tertiary-fixed border-[2px] border-on-surface rounded-full font-label-caps text-[10px] font-bold uppercase select-none">
                Identity Engine v1.0
              </div>
              <h2 className="font-display text-headline-lg font-black tracking-tight text-on-surface">
                Let's claim your professional ledger.
              </h2>
              <p className="font-body-md text-on-surface-variant leading-relaxed">
                Kaami is a cryptographic proof-of-work space where you publish verifiable achievements, sync GitHub activity, and manage your public professional record.
              </p>
              <div className="p-4 bg-secondary-container border-[3px] border-on-surface neubrutal-shadow-sm rounded-lg flex items-start gap-3">
                <span className="material-symbols-outlined text-secondary font-bold">verified_user</span>
                <div>
                  <h4 className="font-headline-md text-[14px] font-black uppercase tracking-wide">
                    Zero Fluff. Pure Evidence.
                  </h4>
                  <p className="font-body-sm text-[12px] text-on-secondary-container/80 mt-1">
                    No endorsements from fake accounts. Show real repository syncs, validated employment, and cryptographically verified certificates.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: PROFESSION */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-headline-md text-headline-md font-black uppercase text-on-surface">
                  What is your primary craft?
                </h3>
                <p className="font-body-sm text-on-surface-variant">
                  We'll customize your dashboard widgets and suggests proofs based on your profession.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                {professions.map((prof) => (
                  <button
                    key={prof.id}
                    onClick={() => setProfession(prof.id)}
                    className={`p-4 border-[2px] border-on-surface rounded-lg font-bold flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                      profession === prof.id
                        ? "bg-primary-container text-on-primary-container translate-x-[1px] translate-y-[1px] shadow-none"
                        : "bg-white hover:bg-white/50 shadow-sm hover:translate-x-[1px] hover:translate-y-[1px]"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[24px]">{prof.icon}</span>
                    <span className="font-label-caps text-[11px] text-center tracking-tight leading-none">
                      {prof.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: PUBLIC IDENTITY */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-headline-md text-headline-md font-black uppercase text-on-surface">
                  Reserve Public Profile URL
                </h3>
                <p className="font-body-sm text-on-surface-variant">
                  This will become your permanent public identity. It will appear on your business cards, resume, and signatures.
                </p>
              </div>

              <div className="flex flex-col md:flex-row gap-6 pt-2">
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="block font-label-caps text-[10px] text-on-surface-variant font-bold uppercase mb-1.5">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="e.g. Alex Rivers"
                      className="w-full border-[2px] border-on-surface p-2.5 bg-white font-body-md rounded-md focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-label-caps text-[10px] text-on-surface-variant font-bold uppercase mb-1.5">
                      Choose Username
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ""))}
                        placeholder="e.g. alex-rivers"
                        className={`w-full border-[2px] border-on-surface p-2.5 pr-20 bg-white font-mono text-[14px] rounded-md focus:outline-none ${
                          !isAvailable && username.length > 0 ? "border-error bg-error-container/20" : ""
                        }`}
                      />
                      <div className="absolute right-3 top-3 flex items-center gap-1">
                        {isChecking ? (
                          <span className="material-symbols-outlined text-[18px] animate-spin text-on-surface-variant">sync</span>
                        ) : username.length < 3 ? (
                          <span className="text-[10px] font-mono text-on-surface-variant/50">Too short</span>
                        ) : isAvailable ? (
                          <span className="material-symbols-outlined text-[18px] text-secondary font-bold">check_circle</span>
                        ) : (
                          <span className="material-symbols-outlined text-[18px] text-error font-bold">cancel</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* URL preview */}
                  <div className="p-3 bg-surface-container-low border-[2px] border-on-surface rounded-md">
                    <span className="font-label-caps text-[9px] text-on-surface-variant block uppercase font-bold mb-1">
                      Live URL Preview
                    </span>
                    <div className="font-mono text-[13px] font-bold text-primary truncate">
                      {baseUrl}/{username || "..."}
                    </div>
                  </div>
                </div>

                {/* QR Code preview beside URL */}
                <div className="w-full md:w-36 flex flex-col items-center justify-center border-[2px] border-on-surface bg-white p-4 rounded-lg neubrutal-shadow-sm select-none">
                  <span className="font-label-caps text-[9px] text-on-surface-variant uppercase font-black mb-2 text-center">
                    Profile QR
                  </span>
                  <div className="w-24 h-24 border-[2px] border-on-surface bg-white flex items-center justify-center p-1 overflow-hidden">
                    {username ? (
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://${baseUrl}/${username}`}
                        alt="Profile QR Code"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <span className="text-[10px] text-on-surface-variant/40 text-center font-bold">Waiting for username</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Suggestions */}
              {!isChecking && !isAvailable && username.length >= 3 && (
                <div className="space-y-1.5">
                  <span className="text-[12px] text-error font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">info</span>
                    This username is reserved or taken. Try:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((s) => (
                      <button
                        key={s}
                        onClick={() => setUsername(s)}
                        className="px-2 py-1 bg-surface-container-high border-[2px] border-on-surface font-mono text-[11px] font-bold hover:bg-primary-container hover:text-on-primary-container rounded transition-colors cursor-pointer"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: SELECT PORTFOLIO THEME */}
          {step === 4 && (
            <div className="space-y-4">
              <div>
                <h3 className="font-headline-md text-headline-md font-black uppercase text-on-surface">
                  Select Visual Profile Theme
                </h3>
                <p className="font-body-sm text-on-surface-variant">
                  Pick the starting visual identity of your public proof page. You can customize the borders, colors, and layout structure anytime.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {themes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`p-3 border-[2px] border-on-surface rounded-lg text-left cursor-pointer flex gap-3 transition-all ${
                      theme === t.id
                        ? "bg-white translate-x-[1px] translate-y-[1px] ring-3 ring-primary"
                        : "bg-white hover:bg-white/50 hover:translate-x-[1px] hover:translate-y-[1px]"
                    }`}
                  >
                    {/* Visual box preview of template style */}
                    <div className={`w-14 h-14 border-[2px] border-on-surface rounded ${t.colors} flex flex-col p-1.5 justify-between shrink-0 overflow-hidden`}>
                      <div className="w-full h-1 bg-on-surface/40 rounded-full"></div>
                      <div className="space-y-1">
                        <div className="w-2/3 h-1 bg-on-surface/40 rounded-full"></div>
                        <div className="w-1/2 h-1 bg-on-surface/40 rounded-full"></div>
                      </div>
                      <div className="w-full flex gap-1">
                        <div className="w-2.5 h-2 border border-on-surface rounded-xs"></div>
                        <div className="w-2.5 h-2 border border-on-surface rounded-xs"></div>
                      </div>
                    </div>
                    <div>
                      <div className="font-bold text-[13px] text-on-surface leading-tight">
                        {t.label}
                      </div>
                      <div className="text-[11px] text-on-surface-variant mt-1 leading-snug">
                        {t.desc}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 5: SETUP COMPLETE */}
          {step === 5 && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <span className="text-[48px] animate-bounce inline-block">🎉</span>
                <h3 className="font-display text-headline-lg font-black tracking-tight text-on-surface">
                  Ledger Registered Successfully!
                </h3>
                <p className="font-body-md text-on-surface-variant">
                  Your public professional identity is set up and active immediately.
                </p>
              </div>

              {/* Identity preview card */}
              <div className="p-4 bg-white border-[3px] border-on-surface neubrutal-shadow-sm rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-secondary-container border-[2px] border-on-surface rounded-full flex items-center justify-center font-bold text-headline-md uppercase text-on-secondary-container">
                    {displayName ? displayName.charAt(0) : "K"}
                  </div>
                  <div>
                    <div className="font-headline-md text-[18px] font-black">{displayName || "Your Profile"}</div>
                    <div className="font-mono text-[11px] text-primary">{baseUrl}/{username}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 font-label-caps text-[10px] font-bold bg-[#FFF9E6] border-[2px] border-on-surface px-3 py-1.5 rounded">
                  <span className="material-symbols-outlined text-[16px] text-secondary font-bold">verified</span>
                  <span>Strength: 12%</span>
                </div>
              </div>

              <div className="p-4 bg-surface-container-low border-[2px] border-on-surface rounded-lg space-y-2">
                <div className="flex justify-between items-center text-[12px] font-mono font-bold">
                  <span>Activation checklist initialized</span>
                  <span className="text-primary">+12% strength</span>
                </div>
                <div className="w-full bg-slate-200 h-3 border-[2px] border-on-surface rounded-full overflow-hidden">
                  <div className="bg-primary h-full transition-all duration-500" style={{ width: "12%" }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* BOTTOM NAV BUTTONS */}
        <div className="flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center gap-3 p-6 sm:p-8 pt-4 border-t-2 border-on-surface/20 shrink-0 bg-white">
          {step > 1 ? (
            <button
              onClick={handleBack}
              className="px-4 py-2.5 border-[2px] border-on-surface bg-white text-on-surface font-bold rounded-lg hover:bg-slate-50 flex items-center justify-center gap-1 cursor-pointer transition-colors w-full sm:w-auto"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              Back
            </button>
          ) : (
            <div className="hidden sm:block" />
          )}

          <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
            {step === 5 ? (
              <>
                <a
                  href={`/${username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 border-[2px] border-on-surface bg-white text-on-surface font-bold rounded-lg hover:bg-slate-50 cursor-pointer flex items-center justify-center gap-1.5 transition-all text-xs w-full sm:w-auto"
                >
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                  View Profile
                </a>
                <NeubrutalButton
                  onClick={handleNext}
                  className="px-6 py-3 bg-primary-container text-on-primary-container font-headline-md text-headline-md w-full sm:w-auto text-center flex justify-center"
                  shadowSize="sm"
                >
                  Open Dashboard
                </NeubrutalButton>
              </>
            ) : (
              <NeubrutalButton
                onClick={handleNext}
                disabled={step === 3 && (!username || !isAvailable || isChecking)}
                className={`px-8 py-3 bg-primary-container text-on-primary-container font-headline-md text-headline-md w-full sm:w-auto text-center flex justify-center ${
                  step === 3 && (!username || !isAvailable || isChecking) ? "opacity-50 cursor-not-allowed" : ""
                }`}
                shadowSize="sm"
              >
                {step === 4 ? "Finalize" : "Continue"}
              </NeubrutalButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
