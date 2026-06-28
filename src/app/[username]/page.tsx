"use client";

import React, { useState, useEffect } from "react";

interface ProfilePageProps {
  params: Promise<{ username: string }>;
}

export default function PublicProfilePage({ params }: ProfilePageProps) {
  const { username } = React.use(params);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [baseUrl, setBaseUrl] = useState("kaami.io");

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    if (typeof window !== "undefined") {
      setBaseUrl(window.location.host);
    }
  }, []);

  useEffect(() => {
    const fetchPublicData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${backendUrl}/api/profile/public/${username}`);
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error("This profile ledger has not been registered yet on Kaami OS.");
          }
          throw new Error("Could not reach verification database.");
        }
        const resData = await res.json();
        setData(resData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPublicData();
  }, [username]);

  if (loading) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-[#FFF9E6] font-sans text-on-surface">
        <div className="flex flex-col items-center gap-3">
          <span className="material-symbols-outlined text-[48px] animate-spin text-primary">sync</span>
          <span className="font-mono text-xs font-bold">Querying Verification Ledger Node...</span>
        </div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-[#FFF9E6] font-sans text-on-surface p-6">
        <div className="bg-white border-[3px] border-on-surface p-8 neubrutal-shadow rounded-xl max-w-md text-center space-y-5">
          <span className="material-symbols-outlined text-[64px] text-error font-bold">report</span>
          <div className="space-y-2">
            <h3 className="font-display text-2xl font-black uppercase text-on-surface">Verification Failure</h3>
            <p className="font-body-md text-xs text-on-surface-variant leading-relaxed">{error}</p>
          </div>
          <button
            onClick={() => window.location.href = "/"}
            className="px-5 py-2 bg-on-surface text-white text-xs font-bold border border-on-surface rounded cursor-pointer"
          >
            Return to Kaami Home
          </button>
        </div>
      </main>
    );
  }

  const { profile, projects, certificates, testimonials } = data;
  const theme = profile.themeMode || "modern";

  // Dynamic Theme Colors
  let bgClass = "bg-[#FFF9E6]";
  let containerBg = "bg-white";
  let borderClass = "border-on-surface";
  let textClass = "text-on-surface";
  let accentText = "text-primary";

  if (theme === "minimal") {
    bgClass = "bg-white";
    containerBg = "bg-white";
    accentText = "text-black";
  } else if (theme === "creative") {
    bgClass = "bg-[#d0f4f0]";
    containerBg = "bg-white";
    accentText = "text-[#006b5b]";
  } else if (theme === "professional") {
    bgClass = "bg-[#f8f9fa]";
    containerBg = "bg-white";
    accentText = "text-[#ab3500]";
  } else if (theme === "corporate") {
    bgClass = "bg-slate-950";
    containerBg = "bg-slate-900";
    borderClass = "border-slate-700";
    textClass = "text-slate-100";
    accentText = "text-primary-container";
  }

  return (
    <main className={`min-h-screen ${bgClass} ${textClass} font-sans py-12 px-6 transition-all duration-300`}>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* PROFILE CARD */}
        <div className={`${containerBg} border-[3px] ${borderClass} p-6 md:p-8 neubrutal-shadow rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6`}>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full border-[3px] border-on-surface bg-secondary-container text-on-secondary-container flex items-center justify-center font-display text-2xl font-black uppercase shrink-0">
              {profile.displayName.charAt(0)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-2xl md:text-3xl font-black leading-none">{profile.displayName}</h1>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-secondary-container text-on-secondary-container border border-on-surface rounded text-[9px] font-bold uppercase select-none">
                  <span className="material-symbols-outlined text-[10px] font-bold">verified</span>
                  Verified
                </span>
              </div>
              <p className="font-mono text-xs mt-1.5" style={{ color: theme === "corporate" ? "#38bdf8" : "#ab3500" }}>
                km.to/{profile.username}
              </p>
              <div className="font-label-caps text-[10px] font-black uppercase text-on-surface-variant mt-1.5">
                {profile.profession.toUpperCase()}
              </div>
            </div>
          </div>

          <div className="flex gap-2 self-start md:self-auto shrink-0">
            <span className="font-mono text-xs font-bold px-3 py-1 bg-surface-container-low border-[2px] border-on-surface rounded uppercase">
              {profile.availability === "open-roles" ? "🟢 Open to Roles" : profile.availability === "freelance" ? "🟡 Freelance" : "🔴 Closed"}
            </span>
          </div>
        </div>

        {/* BIO SUMMARY */}
        <div className={`${containerBg} border-[3px] ${borderClass} p-6 md:p-8 neubrutal-shadow rounded-xl space-y-4`}>
          <h3 className="font-headline-md text-lg font-black uppercase">Professional Statement</h3>
          <p className="font-body-md text-sm md:text-base leading-relaxed opacity-90">
            {profile.bio || "No professional statement logged on this ledger node."}
          </p>
        </div>

        {/* REORDERABLE SECTIONS */}
        <div className="space-y-8">
          {/* PROJECTS */}
          {projects.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-headline-md text-lg font-black uppercase border-b-2 border-on-surface pb-1">
                Verified Projects
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((proj: any) => (
                  <div key={proj.id} className={`${containerBg} border-[3px] ${borderClass} p-5 neubrutal-shadow-sm rounded-xl flex flex-col justify-between space-y-4`}>
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <span className="font-mono text-[9px] bg-slate-100 border border-on-surface px-1.5 py-0.5 rounded font-bold">
                          {proj.year}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[8.5px] bg-[#d0f4f0] text-[#006b5b] border border-on-surface px-1.5 py-0.5 rounded font-bold uppercase">
                          ✓ Sync
                        </span>
                      </div>
                      <h4 className="font-headline-md text-base font-black leading-tight">{proj.title}</h4>
                      <p className="text-xs text-on-surface-variant mt-2 leading-relaxed line-clamp-3">{proj.description}</p>
                    </div>

                    <div className="pt-3 border-t border-on-surface/10 space-y-3">
                      <div className="flex flex-wrap gap-1">
                        {proj.tech.map((t: string) => (
                          <span key={t} className="px-1.5 py-0.5 bg-slate-100 border border-on-surface rounded text-[9px] font-mono font-bold">
                            {t}
                          </span>
                        ))}
                      </div>
                      <div className="flex justify-between items-center text-[10px] font-mono">
                        <span className="opacity-60">Stars: {proj.stars || "0"}</span>
                        <a
                          href={`https://${proj.link}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold underline text-primary hover:text-primary/80"
                        >
                          View Repository →
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CERTIFICATES */}
          {certificates.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-headline-md text-lg font-black uppercase border-b-2 border-on-surface pb-1">
                Linked Credentials
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {certificates.map((cert: any) => (
                  <div key={cert.id} className={`${containerBg} border-[3px] ${borderClass} p-5 neubrutal-shadow-sm rounded-xl flex flex-col justify-between space-y-4`}>
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <span className="material-symbols-outlined text-[28px]" style={{ color: theme === "corporate" ? "#38bdf8" : "#ab3500" }}>
                          workspace_premium
                        </span>
                        <span className="inline-flex items-center gap-0.5 px-1 py-0.5 bg-[#FFF9E6] border border-on-surface rounded text-[8px] font-bold uppercase select-none">
                          Verified
                        </span>
                      </div>
                      <h4 className="font-headline-md text-xs font-black leading-snug">{cert.title}</h4>
                      <p className="text-[10px] text-on-surface-variant font-bold mt-1">{cert.issuer}</p>
                    </div>

                    <div className="border-t border-on-surface/10 pt-2.5 mt-2.5 text-[9px] font-mono opacity-80 space-y-0.5">
                      <div>ID: {cert.credential_id}</div>
                      <div>Date: {cert.issue_date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TESTIMONIALS */}
          {testimonials.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-headline-md text-lg font-black uppercase border-b-2 border-on-surface pb-1">
                Verified Endorsements
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {testimonials.map((test: any, idx: number) => (
                  <div key={idx} className={`${containerBg} border-[3px] ${borderClass} p-5 neubrutal-shadow-sm rounded-xl flex flex-col justify-between space-y-4`}>
                    <div className="space-y-2">
                      <span className="material-symbols-outlined text-[24px] text-tertiary">format_quote</span>
                      <p className="text-xs italic leading-relaxed">"{test.quote}"</p>
                    </div>
                    <div className="border-t border-on-surface/10 pt-2.5">
                      <span className="font-bold text-xs block">{test.author}</span>
                      <span className="text-[10px] text-on-surface-variant block">{test.role}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* PROFILE QR & FOOTER */}
        <div className="pt-8 border-t-2 border-on-surface/20 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            {/* Real QR Server API call dynamically generating the QR Code */}
            <div className="w-16 h-16 border-[2px] border-on-surface bg-white p-1 rounded shrink-0">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://${baseUrl}/${username}`}
                alt="Profile QR Code"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h5 className="font-headline-md text-xs font-black uppercase">Scan to Verify</h5>
              <p className="text-[10px] text-on-surface-variant leading-snug">
                Scan this cryptographical key token to inspect verification signatures on mobile.
              </p>
            </div>
          </div>
          <span className="font-mono text-[10px] opacity-50">
            Powered by Kaami OS Ledger Nodes
          </span>
        </div>
      </div>
    </main>
  );
}
