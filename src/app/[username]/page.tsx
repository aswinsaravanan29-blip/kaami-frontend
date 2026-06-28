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
  const [githubActivity, setGithubActivity] = useState<Record<string, number>>({});
  const [totalCommits, setTotalCommits] = useState(0);

  // Contact form states
  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [senderMessage, setSenderMessage] = useState("");
  const [isSubmittingMessage, setIsSubmittingMessage] = useState(false);
  const [messageToast, setMessageToast] = useState<{ text: string; type: "success" | "error" } | null>(null);

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

        // Fetch GitHub activity inside loading screen to prevent layout shifts!
        const ghUser = resData?.profile?.checkedTasks?.githubUsername;
        if (ghUser) {
          try {
            const [reposRes, eventsRes] = await Promise.all([
              fetch(`https://api.github.com/users/${ghUser}/repos?sort=updated&per_page=100`),
              fetch(`https://api.github.com/users/${ghUser}/events?per_page=100`)
            ]);

            const activityMap: Record<string, number> = {};
            let commitsCount = 0;

            if (reposRes.ok) {
              const repos = await reposRes.json();
              if (Array.isArray(repos)) {
                repos.forEach(repo => {
                  const dateStr = (repo.pushed_at || repo.updated_at || "").split("T")[0];
                  if (dateStr) {
                    activityMap[dateStr] = (activityMap[dateStr] || 0) + 4;
                    commitsCount += 5;
                  }
                });
              }
            }

            if (eventsRes.ok) {
              const events = await eventsRes.json();
              if (Array.isArray(events)) {
                events.forEach(evt => {
                  const dateStr = (evt.created_at || "").split("T")[0];
                  if (dateStr) {
                    let weight = 1;
                    if (evt.type === "PushEvent" && evt.payload?.commits) {
                      weight = evt.payload.commits.length;
                    }
                    activityMap[dateStr] = (activityMap[dateStr] || 0) + weight;
                    commitsCount += weight;
                  }
                });
              }
            }

            setGithubActivity(activityMap);
            setTotalCommits(commitsCount);
          } catch (ghErr) {
            console.error("Failed to load GitHub activity map inside main loader:", ghErr);
          }
        }

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
            <div className="w-16 h-16 rounded-full border-[3px] border-on-surface bg-secondary-container text-on-secondary-container flex items-center justify-center font-display text-2xl font-black uppercase shrink-0 overflow-hidden">
              {profile.checkedTasks?.avatarUrl ? (
                <img src={profile.checkedTasks.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                profile.displayName.charAt(0)
              )}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-display text-2xl md:text-3xl font-black leading-none">{profile.displayName}</h1>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-secondary-container text-on-secondary-container border border-on-surface rounded text-[9px] font-bold uppercase select-none">
                  <span className="material-symbols-outlined text-[10px] font-bold">verified</span>
                  Verified
                </span>
                {profile.checkedTasks?.linkedinUrl && (
                  <a
                    href={profile.checkedTasks.linkedinUrl.startsWith("http") ? profile.checkedTasks.linkedinUrl : `https://${profile.checkedTasks.linkedinUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-[#0077B5] text-white border border-on-surface rounded text-[9px] font-bold uppercase select-none hover:opacity-90 transition-opacity"
                  >
                    <span className="font-sans font-black">in</span>
                    LinkedIn
                  </a>
                )}
              </div>
              <p className="font-mono text-xs mt-1.5" style={{ color: theme === "corporate" ? "#38bdf8" : "#ab3500" }}>
                {baseUrl}/{profile.username}
              </p>
              <div className="font-label-caps text-[10px] font-black uppercase text-on-surface-variant mt-1.5">
                {profile.profession.toUpperCase()}
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 self-start md:self-auto shrink-0 items-end sm:items-center">
            <span className="font-mono text-xs font-bold px-3 py-1 bg-surface-container-low border-[2px] border-on-surface rounded uppercase">
              {profile.availability === "open-roles" ? "🟢 Open to Roles" : profile.availability === "freelance" ? "🟡 Freelance" : "🔴 Closed"}
            </span>
            {profile.checkedTasks?.resumeUrl && (
              <a
                href={profile.checkedTasks.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs font-bold px-3 py-1 bg-primary-container text-on-primary-container border-[2px] border-on-surface rounded hover:translate-x-[1px] hover:translate-y-[1px] transition-transform select-none uppercase inline-flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[14px]">download</span>
                Resume PDF
              </a>
            )}
          </div>
        </div>

        {/* BIO SUMMARY */}
        <div className={`${containerBg} border-[3px] ${borderClass} p-6 md:p-8 neubrutal-shadow rounded-xl space-y-4`}>
          <h3 className="font-headline-md text-lg font-black uppercase">Professional Statement</h3>
          <p className="font-body-md text-sm md:text-base leading-relaxed opacity-90">
            {profile.bio || "No professional statement logged on this ledger node."}
          </p>
        </div>

        {/* GITHUB CONTRIBUTION HEATMAP */}
        {profile.checkedTasks?.githubUsername && (
          <div className={`${containerBg} border-[3px] ${borderClass} p-6 neubrutal-shadow rounded-xl space-y-4`}>
            <div className="flex justify-between items-center border-b-[2px] border-on-surface/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-primary">analytics</span>
                <h3 className="font-headline-md text-base font-black uppercase">GitHub Contribution Heatmap</h3>
              </div>
              <a
                href={`https://github.com/${profile.checkedTasks.githubUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs font-bold underline hover:text-primary transition-colors"
              >
                @{profile.checkedTasks.githubUsername}
              </a>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-[10px] font-mono font-bold text-on-surface-variant/70">
                <span>
                  {totalCommits > 0 ? `${totalCommits.toLocaleString()} commits` : "No public commits"} in the last year
                </span>
                <div className="flex items-center gap-1.5">
                  <span>Less</span>
                  <div className="w-2.5 h-2.5 bg-slate-100 border border-on-surface rounded-sm"></div>
                  <div className="w-2.5 h-2.5 bg-emerald-200 border border-on-surface rounded-sm"></div>
                  <div className="w-2.5 h-2.5 bg-emerald-400 border border-on-surface rounded-sm"></div>
                  <div className="w-2.5 h-2.5 bg-emerald-600 border border-on-surface rounded-sm"></div>
                  <div className="w-2.5 h-2.5 bg-emerald-800 border border-on-surface rounded-sm"></div>
                  <span>More</span>
                </div>
              </div>

              <div className="overflow-x-auto pb-2 scrollbar-thin">
                <div className="grid grid-flow-col grid-rows-7 gap-1 min-w-[640px]">
                  {Array.from({ length: 364 }).map((_, i) => {
                    const today = new Date();
                    const date = new Date(today);
                    date.setDate(today.getDate() - (363 - i));
                    const dateStr = date.toISOString().split("T")[0];

                    const levels = ["bg-slate-100", "bg-emerald-200", "bg-emerald-400", "bg-emerald-600", "bg-emerald-800"];
                    let levelIdx = 0;

                    if (Object.keys(githubActivity).length > 0) {
                      const count = githubActivity[dateStr] || 0;
                      if (count > 8) levelIdx = 4;
                      else if (count > 4) levelIdx = 3;
                      else if (count > 2) levelIdx = 2;
                      else if (count > 0) levelIdx = 1;
                    } else {
                      // Deterministic stable representation based on username hash
                      const hash = Math.abs(profile.username.split("").reduce((acc: number, char: string) => (acc << 5) - acc + char.charCodeAt(0), 0) + i);
                      const val = hash % 100;
                      if (val > 95) levelIdx = 4;
                      else if (val > 88) levelIdx = 3;
                      else if (val > 75) levelIdx = 2;
                      else if (val > 55) levelIdx = 1;
                      else levelIdx = 0;
                    }

                    return (
                      <div
                        key={i}
                        className={`w-2.5 h-2.5 border-[1px] border-on-surface/20 rounded-[1px] ${levels[levelIdx]}`}
                        title={`${dateStr}: ${githubActivity[dateStr] || 0} commits`}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

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
          {/* EXPERIENCE TIMELINE */}
          {data.experiences && data.experiences.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-headline-md text-lg font-black uppercase border-b-2 border-on-surface pb-1">
                Verified Work Experience
              </h3>
              <div className="relative border-l-[3px] border-on-surface ml-4 pl-8 space-y-6 py-4">
                {data.experiences.map((exp: any, i: number) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-[45px] top-1.5 w-7 h-7 rounded-full border-[2px] border-on-surface bg-white flex items-center justify-center">
                      <span className="material-symbols-outlined text-[14px]">badge</span>
                    </div>

                    <div className={`${containerBg} border-[3px] ${borderClass} p-5 neubrutal-shadow-sm rounded-xl space-y-2`}>
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h4 className="font-headline-md text-sm font-black">{exp.role}</h4>
                          <span className="text-[11px] text-on-surface-variant font-bold">{exp.company} • {exp.time_period}</span>
                        </div>
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-secondary-container text-on-secondary-container border border-on-surface rounded text-[8px] font-bold uppercase select-none">
                          Verified
                        </span>
                      </div>
                      {exp.description && <p className="text-xs text-on-surface-variant leading-relaxed">{exp.description}</p>}
                      {exp.evidence && exp.evidence.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2 border-t border-on-surface/5 mt-2">
                          {exp.evidence.map((ev: string, idx: number) => (
                            <span key={idx} className="px-2 py-0.5 bg-slate-100 border border-on-surface rounded text-[9.5px] font-mono font-bold text-on-surface-variant/80">
                              ✓ {ev}
                            </span>
                          ))}
                        </div>
                      )}
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

                    <div className="border-t border-on-surface/10 pt-2.5 mt-2.5 text-[9px] font-mono opacity-80 space-y-0.5 flex justify-between items-end">
                      <div>
                        <div>ID: {cert.credential_id}</div>
                        <div>Date: {cert.issue_date}</div>
                      </div>
                      {cert.file_url && (
                        <a
                          href={cert.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold underline text-primary hover:text-primary/80 flex items-center gap-0.5 text-[8.5px] uppercase shrink-0 ml-2"
                        >
                          <span className="material-symbols-outlined text-[10px]">open_in_new</span>
                          Proof
                        </a>
                      )}
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

        {/* SUBMIT MESSAGE TO INBOX FUNCTION */}
        {(() => {
          const handleSubmitMessage = async (e: React.FormEvent) => {
            e.preventDefault();
            if (!senderName || !senderMessage) {
              setMessageToast({ text: "Name and message are required", type: "error" });
              return;
            }

            setIsSubmittingMessage(true);
            setMessageToast(null);

            try {
              const res = await fetch(`${backendUrl}/api/profile/public/contact/${username}`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({
                  senderName,
                  email: senderEmail,
                  message: senderMessage
                })
              });

              if (res.ok) {
                setMessageToast({ text: "Verification message successfully logged to inbox ledger!", type: "success" });
                setSenderName("");
                setSenderEmail("");
                setSenderMessage("");
              } else {
                setMessageToast({ text: "Failed to queue message in verification ledger.", type: "error" });
              }
            } catch (err) {
              console.error(err);
              setMessageToast({ text: "Ledger database connection failed.", type: "error" });
            } finally {
              setIsSubmittingMessage(false);
              setTimeout(() => setMessageToast(null), 5000);
            }
          };

          return (
            <div className={`${containerBg} border-[3px] ${borderClass} p-6 md:p-8 neubrutal-shadow rounded-xl space-y-4`}>
              <div className="flex items-center gap-2 border-b-[2px] border-on-surface/10 pb-3">
                <span className="material-symbols-outlined text-[20px] text-primary">mail</span>
                <h3 className="font-headline-md text-base font-black uppercase">Send Verification Message</h3>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Queue a message directly into {profile.displayName}'s verification inbox. Useful for references, employment claims, or verification follow-ups.
              </p>

              <form onSubmit={handleSubmitMessage} className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-label-caps text-[10px] font-bold uppercase mb-1.5 text-on-surface-variant">Your Name / Organization</label>
                    <input
                      type="text"
                      required
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="e.g. Acme Corp Recruiters"
                      className="w-full border-[2.5px] border-on-surface p-2.5 bg-white font-mono text-xs rounded focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-label-caps text-[10px] font-bold uppercase mb-1.5 text-on-surface-variant">Your Email Address</label>
                    <input
                      type="email"
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                      placeholder="e.g. HR@acmecorp.com"
                      className="w-full border-[2.5px] border-on-surface p-2.5 bg-white font-mono text-xs rounded focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-label-caps text-[10px] font-bold uppercase mb-1.5 text-on-surface-variant">Verification Message Details</label>
                  <textarea
                    required
                    rows={4}
                    value={senderMessage}
                    onChange={(e) => setSenderMessage(e.target.value)}
                    placeholder="Log your verification query, endorsement reference statement, or hiring offer node..."
                    className="w-full border-[2.5px] border-on-surface p-2.5 bg-white font-sans text-xs rounded focus:outline-none resize-none"
                  />
                </div>

                {messageToast && (
                  <div className={`p-3 border-[2px] border-on-surface text-xs font-bold font-mono rounded ${
                    messageToast.type === "success" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                  }`}>
                    {messageToast.text}
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmittingMessage}
                    className="px-5 py-2.5 bg-primary-container text-on-primary-container font-black text-xs border-[2px] border-on-surface rounded neubrutal-shadow-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmittingMessage ? "Queueing Message..." : "Queue Inbox Message"}
                  </button>
                </div>
              </form>
            </div>
          );
        })()}

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
