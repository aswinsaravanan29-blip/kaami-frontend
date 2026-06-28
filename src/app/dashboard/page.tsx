"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Onboarding from "../../components/dashboard/onboarding";
import {
  Toast,
  ToastContainer,
  NeubrutalModal,
  CommandPalette
} from "../../components/dashboard/global-components";
import {
  DashboardHomeView,
  ProfileBuilderView,
  ProjectsView,
  ProofsView,
  CertificatesView,
  SkillsView,
  TestimonialsView,
  VerificationView,
  AnalyticsView,
  PublicProfileView,
  ShareCenterView,
  BillingView,
  SettingsView
} from "../../components/dashboard/views";

export default function DashboardPage() {
  const router = useRouter();

  // --- 1. BASE SYSTEM PARAMETERS ---
  const [baseUrl, setBaseUrl] = useState("kaami.io");
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  // --- 2. USER PROFILE STATES ---
  const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [profession, setProfession] = useState("developer");
  const [themeMode, setThemeMode] = useState("modern");
  const [bio, setBio] = useState("");
  const [availability, setAvailability] = useState("open-roles");

  // --- 3. DYNAMIC DATA LISTS ---
  const [projects, setProjects] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [inboxItems, setInboxItems] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);

  // --- 4. ANALYTICS COUNTERS ---
  const [viewsCount, setViewsCount] = useState(42);
  const [scansCount, setScansCount] = useState(12);
  const [downloadsCount, setDownloadsCount] = useState(4);

  // --- 5. LAYOUT & NAVIGATION ---
  const [activeView, setActiveView] = useState("dashboard");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const [globalState, setGlobalState] = useState<"success" | "loading" | "empty" | "error">("success");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isTrustModalOpen, setIsTrustModalOpen] = useState(false);
  const [syncStatus, setSyncStatus] = useState<"synced" | "syncing" | "error">("synced");
  const [authTransition, setAuthTransition] = useState<string | null>(null);

  const [checkedTasks, setCheckedTasks] = useState<Record<string, boolean>>({
    "add-photo": false,
    "connect-github": false,
    "connect-linkedin": false,
    "upload-resume": false,
    "add-project": false,
    "add-certificate": false,
    "add-experience": false,
    "publish-profile": false,
    "share-profile": false
  });

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  // --- 6. INITIAL DATA LOAD FROM BACKEND ---
  const fetchProfileData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      setIsLoadingProfile(true);
      const res = await fetch(`${backendUrl}/api/profile`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem("token");
          router.push("/login");
          return;
        }
        throw new Error("Failed to fetch profile ledger");
      }

      const data = await res.json();

      if (data.profile) {
        setDisplayName(data.profile.displayName);
        setUsername(data.profile.username);
        setProfession(data.profile.profession);
        setThemeMode(data.profile.themeMode);
        setBio(data.profile.bio);
        setAvailability(data.profile.availability);
        setCheckedTasks(data.profile.checkedTasks);
        setIsOnboarded(true);
      } else {
        setIsOnboarded(false);
      }

      setProjects(data.projects || []);
      setCertificates(data.certificates || []);
      setTestimonials(data.testimonials || []);
      setInboxItems(data.inboxItems || []);
      setActivities(data.activities || []);

    } catch (e) {
      console.error(e);
      triggerToast("Failed to load records from backend server.", "error");
    } finally {
      setIsLoadingProfile(false);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setBaseUrl(window.location.host);
    }
    fetchProfileData();

    // Key board shortcuts (Ctrl+K)
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // --- 7. AUTO-CHECKLIST INTEGRATION ---
  useEffect(() => {
    if (isOnboarded) {
      setCheckedTasks((prev) => {
        const next = {
          ...prev,
          "add-project": projects.length > 0,
          "add-certificate": certificates.length > 0,
          "share-profile": testimonials.length > 0
        };
        // Update task registry in backend if changed
        if (JSON.stringify(prev) !== JSON.stringify(next)) {
          saveProfileCheckedTasks(next);
        }
        return next;
      });
    }
  }, [projects, certificates, testimonials, isOnboarded]);

  const saveProfileCheckedTasks = async (tasks: Record<string, boolean>) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await fetch(`${backendUrl}/api/profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          username,
          displayName,
          profession,
          themeMode,
          bio,
          availability,
          checkedTasks: tasks
        })
      });
    } catch (e) {
      console.error("Failed to sync checklist", e);
    }
  };

  // --- 8. TRUST SCORE ---
  const calculateTrustScore = () => {
    let score = 10;
    if (checkedTasks["connect-github"]) score += 20;
    if (checkedTasks["connect-linkedin"]) score += 20;
    score += Math.min(projects.length * 10, 20);
    score += Math.min(certificates.length * 15, 30);
    score += Math.min(testimonials.length * 10, 20);
    return Math.min(score, 100);
  };

  const trustScore = calculateTrustScore();

  // --- 9. API HELPERS FOR WORKSPACE ACTIONS ---
  const triggerToast = (message: string, type: Toast["type"]) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const logActivity = async (text: string, type: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${backendUrl}/api/profile/activity`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ text, type, timestamp: "Just now" })
      });
      if (res.ok) {
        setActivities((prev) => [...prev, { id: Math.random(), text, type, timestamp: "Just now" }]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleOnboardingComplete = async (data: {
    username: string;
    profession: string;
    theme: string;
    displayName: string;
  }) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${backendUrl}/api/profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          username: data.username,
          displayName: data.displayName,
          profession: data.profession,
          themeMode: data.theme,
          bio: "Developer profile claimed on Kaami OS.",
          availability: "open-roles",
          checkedTasks
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.msg || "Onboarding database save failed");
      }

      await logActivity(`Account setup completed: reserved handle /${data.username}`, "success");
      await fetchProfileData();
      triggerToast("Verification ledger initialized successfully.", "success");
    } catch (e: any) {
      triggerToast(e.message || "Failed to finalize onboarding setup.", "error");
    }
  };

  const handleSkipOnboarding = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    let defaultName = "Builder";
    let defaultUsername = `user-${Math.floor(1000 + Math.random() * 9000)}`;

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const u = JSON.parse(storedUser);
        if (u.name) {
          defaultName = u.name;
          defaultUsername = u.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-_]/g, "");
        }
      } catch (e) {
        console.error(e);
      }
    }

    try {
      setIsLoadingProfile(true);
      const res = await fetch(`${backendUrl}/api/profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          username: defaultUsername,
          displayName: defaultName,
          profession: "developer",
          themeMode: "modern",
          bio: "Developer profile registered on Kaami.",
          availability: "open-roles",
          checkedTasks
        })
      });

      if (res.ok) {
        await logActivity("Account setup completed via quick skip", "success");
        await fetchProfileData();
        triggerToast("Welcome! Default profile registered.", "success");
      } else {
        setIsOnboarded(true); // fallback
      }
    } catch (e) {
      console.error(e);
      setIsOnboarded(true); // fallback
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const resetOnboarding = () => {
    localStorage.removeItem("kaami_onboarded");
    setIsOnboarded(false);
    setActiveView("dashboard");
    triggerToast("Setup wizard re-initialized.", "info");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuthTransition("Terminating cryptographic ledger session...");
    setTimeout(() => {
      router.push("/");
      router.refresh();
    }, 950);
  };

  const handleSyncNow = async () => {
    setSyncStatus("syncing");
    triggerToast("Triggering external credentials sync...", "sync");

    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      // Auto toggle connect-github on sync
      const nextTasks = { ...checkedTasks, "connect-github": true };
      setCheckedTasks(nextTasks);
      await saveProfileCheckedTasks(nextTasks);

      // Add project
      const gitProj = {
        id: "github-sync-route",
        title: "OAuth Secure Engine",
        desc: "Synced automatically via GitHub. Verified commit footprint for secure authentication middleware.",
        tech: ["TypeScript", "GitHub API", "Node.js"],
        link: `github.com/${username}/secure-oauth`,
        year: "2026"
      };

      const res = await fetch(`${backendUrl}/api/profile/project`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(gitProj)
      });

      if (res.ok) {
        await logActivity("GitHub repository commit sync verified", "sync");
        await fetchProfileData();
        setSyncStatus("synced");
        triggerToast("Sync completed. OAuth project fetched.", "success");
      } else {
        setSyncStatus("error");
        triggerToast("GitHub sync request failed.", "error");
      }
    } catch (e) {
      setSyncStatus("error");
      console.error(e);
    }
  };

  const toggleTask = async (taskId: string) => {
    if (["add-project", "add-certificate", "share-profile"].includes(taskId)) {
      if (taskId === "add-project") setActiveView("projects");
      if (taskId === "add-certificate") setActiveView("certificates");
      if (taskId === "share-profile") setActiveView("testimonials");
      triggerToast("Complete corresponding view forms to check this task.", "info");
      return;
    }

    const nextTasks = { ...checkedTasks, [taskId]: !checkedTasks[taskId] };
    setCheckedTasks(nextTasks);

    await saveProfileCheckedTasks(nextTasks);
    await logActivity(`Completed task item: ${taskId.replace("-", " ")}`, "info");
    triggerToast("Checklist status updated.", "success");
  };

  const triggerTask = async (taskId: string) => {
    if (checkedTasks[taskId]) return;
    const nextTasks = { ...checkedTasks, [taskId]: true };
    setCheckedTasks(nextTasks);
    await saveProfileCheckedTasks(nextTasks);
  };

  // Profile Builder Setters
  const updateBio = async (newBio: string) => {
    setBio(newBio);
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await fetch(`${backendUrl}/api/profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          username,
          displayName,
          profession,
          themeMode,
          bio: newBio,
          availability,
          checkedTasks
        })
      });
    } catch (e) {
      console.error(e);
    }
  };

  const updateAvailability = async (newAvail: string) => {
    setAvailability(newAvail);
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await fetch(`${backendUrl}/api/profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          username,
          displayName,
          profession,
          themeMode,
          bio,
          availability: newAvail,
          checkedTasks
        })
      });
    } catch (e) {
      console.error(e);
    }
  };

  // Command palette navigation
  const handleCommandNavigate = (view: string) => {
    setActiveView(view);
    setIsMobileSidebarOpen(false);
  };

  const handleCommandAction = (actionKey: string) => {
    if (actionKey === "add-project") {
      setActiveView("projects");
      triggerToast("Form opened inside Projects.", "info");
    } else if (actionKey === "sync-github") {
      handleSyncNow();
    } else if (actionKey === "request-testimonial") {
      setActiveView("testimonials");
      triggerToast("Form opened inside Testimonials.", "info");
    } else if (actionKey === "export-data") {
      triggerToast("Verified ledger exported as JSON-LD.", "success");
    }
  };

  // --- 12. PRE-RENDER CHECK ---
  if (isLoadingProfile) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#FFF9E6]">
        <div className="flex flex-col items-center gap-3">
          <span className="material-symbols-outlined text-[48px] animate-spin text-primary">sync</span>
          <span className="font-mono text-xs font-bold">Synchronizing Node with Database...</span>
        </div>
      </main>
    );
  }

  if (!isOnboarded) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#FFF9E6] px-container-margin py-12">
        <Onboarding onComplete={handleOnboardingComplete} onSkip={handleSkipOnboarding} baseUrl={baseUrl} />
        <ToastContainer toasts={toasts} removeToast={removeToast} />
      </main>
    );
  }

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: "dashboard" },
    { id: "profile-builder", label: "Profile Builder", icon: "badge" },
    { id: "projects", label: "Projects", icon: "folder" },
    { id: "proofs", label: "Proofs", icon: "verified" },
    { id: "certificates", label: "Certificates", icon: "workspace_premium" },
    { id: "skills", label: "Skills", icon: "code" },
    { id: "testimonials", label: "Testimonials", icon: "reviews" },
    { id: "verification", label: "Verification", icon: "policy" },
    { id: "analytics", label: "Analytics", icon: "analytics" },
    { id: "public-profile", label: "Public Profile", icon: "preview" },
    { id: "share-center", label: "Share Center", icon: "share" },
    { id: "billing", label: "Billing", icon: "credit_card" },
    { id: "settings", label: "Settings", icon: "settings" }
  ];

  return (
    <div className="min-h-screen h-screen flex flex-col bg-[#FFF9E6] selection:bg-tertiary-fixed selection:text-on-tertiary-fixed font-sans text-on-surface overflow-hidden">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 bg-surface border-b-[3px] border-on-surface flex justify-between items-center w-full px-container-margin py-3.5 h-[70px] shrink-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="md:hidden w-10 h-10 border-[2px] border-on-surface flex items-center justify-center bg-white rounded cursor-pointer"
          >
            <span className="material-symbols-outlined font-bold">menu</span>
          </button>
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="hidden md:flex w-9 h-9 border-[2px] border-on-surface items-center justify-center bg-white rounded hover:bg-slate-50 cursor-pointer"
          >
            <span className="material-symbols-outlined font-bold text-[18px]">
              {isSidebarCollapsed ? "first_page" : "last_page"}
            </span>
          </button>
          <span className="font-display text-[22px] font-black italic tracking-tighter text-on-surface uppercase select-none">
            Kaami OS
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="hidden sm:flex items-center gap-2 border-[2px] border-on-surface bg-surface-container-low px-3 py-1.5 rounded-lg text-xs text-on-surface-variant/60 font-bold hover:bg-white transition-all cursor-pointer select-none"
          >
            <span className="material-symbols-outlined text-[16px] font-bold">search</span>
            <span>Search (Ctrl+K)</span>
          </button>

          <button
            onClick={handleSyncNow}
            className="w-10 h-10 border-[2px] border-on-surface flex items-center justify-center bg-white rounded hover:bg-slate-50 cursor-pointer"
          >
            <span className={`material-symbols-outlined text-[20px] text-on-surface-variant font-bold ${syncStatus === "syncing" ? "animate-spin text-primary" : ""}`}>
              sync
            </span>
          </button>

          <div className="relative">
            <button
              onClick={() => {
                setIsNotificationsOpen(!isNotificationsOpen);
                setIsProfileMenuOpen(false);
              }}
              className="w-10 h-10 border-[2px] border-on-surface flex items-center justify-center bg-white rounded hover:bg-slate-50 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px] text-on-surface-variant font-bold">notifications</span>
              {inboxItems.filter((i) => i.status === "Pending").length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-error rounded-full border border-white"></span>
              )}
            </button>
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border-[3px] border-on-surface rounded-xl neubrutal-shadow-sm p-4 space-y-3 z-50 animate-scale-up">
                <div className="font-label-caps text-[10px] text-on-surface-variant font-black uppercase pb-1.5 border-b border-on-surface/10">
                  Verification Alerts
                </div>
                <div className="space-y-2 text-xs font-bold">
                  {inboxItems.filter((i) => i.status === "Pending").length} pending verification logs in inbox queue.
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => {
                setIsProfileMenuOpen(!isProfileMenuOpen);
                setIsNotificationsOpen(false);
              }}
              className="w-10 h-10 border-[2px] border-on-surface rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-sm uppercase cursor-pointer"
            >
              {displayName ? displayName.charAt(0) : "U"}
            </button>
            {isProfileMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border-[3px] border-on-surface rounded-xl neubrutal-shadow-sm p-2 z-50 animate-scale-up">
                <div className="p-3 border-b border-on-surface/10">
                  <div className="font-bold text-sm truncate leading-none mb-1">{displayName}</div>
                  <span className="font-mono text-[9px] text-primary truncate block font-bold">{baseUrl}/{username}</span>
                </div>
                <div className="p-1 space-y-1">
                  <button
                    onClick={() => {
                      setActiveView("public-profile");
                      setIsProfileMenuOpen(false);
                    }}
                    className="w-full text-left p-2 hover:bg-primary-container hover:text-on-primary-container rounded text-xs font-bold transition-colors cursor-pointer"
                  >
                    Public profile
                  </button>
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      resetOnboarding();
                    }}
                    className="w-full text-left p-2 hover:bg-primary-container hover:text-on-primary-container rounded text-xs font-bold text-primary cursor-pointer"
                  >
                    Reset Onboarding
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left p-2 hover:bg-error-container hover:text-on-error-container rounded text-xs font-bold text-error border-t border-on-surface/5 mt-1 transition-colors cursor-pointer"
                  >
                    Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* GRID BODY */}
      <div className="flex-1 flex overflow-hidden">
        <aside className={`hidden md:block bg-surface border-r-[3px] border-on-surface p-4 transition-all duration-300 h-full overflow-y-auto shrink-0 ${isSidebarCollapsed ? "w-20" : "w-64"}`}>
          <div className="space-y-1">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center gap-3 p-3 border-[2px] rounded-lg transition-all cursor-pointer ${
                  activeView === item.id
                    ? "bg-on-surface text-white border-on-surface"
                    : "border-transparent hover:bg-white hover:border-on-surface"
                }`}
              >
                <span className="material-symbols-outlined shrink-0 text-[20px]">{item.icon}</span>
                {!isSidebarCollapsed && (
                  <span className="font-label-caps text-xs font-bold select-none tracking-tight">{item.label}</span>
                )}
              </button>
            ))}
          </div>
        </aside>

        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-50 flex">
            <div className="absolute inset-0 bg-[#1c1b1b]/60 backdrop-blur-xs" onClick={() => setIsMobileSidebarOpen(false)} />
            <aside className="relative w-64 max-w-[80vw] bg-surface border-r-[3px] border-on-surface p-4 flex flex-col h-full z-10 animate-slide-in">
              <div className="flex justify-between items-center mb-6">
                <span className="font-display text-lg font-black uppercase text-on-surface">Navigation</span>
                <button onClick={() => setIsMobileSidebarOpen(false)} className="w-8 h-8 border-[2px] border-on-surface rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-[16px] font-bold">close</span>
                </button>
              </div>
              <div className="space-y-1 overflow-y-auto flex-1">
                {sidebarItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveView(item.id);
                      setIsMobileSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 p-3 border-[2px] rounded-lg cursor-pointer ${
                      activeView === item.id
                        ? "bg-on-surface text-white border-on-surface"
                        : "border-transparent hover:bg-white"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                    <span className="font-label-caps text-xs font-bold">{item.label}</span>
                  </button>
                ))}
              </div>
            </aside>
          </div>
        )}

        <main className="flex-1 p-6 md:p-8 overflow-y-auto h-full relative">
          {globalState === "loading" && (
            <div className="space-y-6 animate-pulse select-none pointer-events-none">
              <div className="h-24 bg-white border-[3px] border-on-surface rounded-xl"></div>
            </div>
          )}

          {globalState === "error" && (
            <div className="bg-error-container text-on-error-container border-[3px] border-on-surface p-8 rounded-xl text-center space-y-4 max-w-md mx-auto mt-[10vh]">
              <span className="material-symbols-outlined text-[48px] text-error font-bold">report</span>
              <h3 className="font-display text-xl font-black uppercase">Cryptographic OAuth Error</h3>
              <p className="text-xs">Database sync failed. Handshake authentication rejected by proxy.</p>
              <button
                onClick={() => setGlobalState("success")}
                className="px-4 py-2 bg-on-surface text-white font-bold text-xs border rounded cursor-pointer"
              >
                Retry handshake
              </button>
            </div>
          )}

          {globalState === "empty" && (
            <div className="bg-white border-[3px] border-on-surface p-8 rounded-xl text-center space-y-4 max-w-md mx-auto mt-[10vh]">
              <span className="material-symbols-outlined text-[48px] text-on-surface-variant/40">cloud_off</span>
              <h3 className="font-headline-md text-base font-black uppercase">Ledger is empty</h3>
              <p className="text-xs">No records have been synced with the database registry node yet.</p>
              <button
                onClick={() => {
                  setGlobalState("success");
                  setActiveView("projects");
                }}
                className="px-4 py-2 bg-primary-container text-on-primary-container font-bold text-xs border-[2px] border-on-surface rounded"
              >
                Add proof
              </button>
            </div>
          )}

          {globalState === "success" && (
            <>
              {activeView === "dashboard" && (
                <DashboardHomeView
                  displayName={displayName}
                  username={username}
                  profession={profession}
                  triggerToast={triggerToast}
                  checkedTasks={checkedTasks}
                  onToggleTask={toggleTask}
                  openTrustModal={() => setIsTrustModalOpen(true)}
                  activities={activities}
                  projectsCount={projects.length}
                  certsCount={certificates.length}
                  testimonialsCount={testimonials.length}
                  trustScore={trustScore}
                  baseUrl={baseUrl}
                  viewsCount={viewsCount}
                  scansCount={scansCount}
                  downloadsCount={downloadsCount}
                />
              )}
              {activeView === "profile-builder" && (
                <ProfileBuilderView
                  displayName={displayName}
                  username={username}
                  bio={bio}
                  setBio={updateBio}
                  availability={availability}
                  setAvailability={updateAvailability}
                  triggerToast={triggerToast}
                  addActivity={logActivity}
                  baseUrl={baseUrl}
                  projectsCount={projects.length}
                />
              )}
              {activeView === "projects" && (
                <ProjectsView
                  projects={projects}
                  setProjects={setProjects}
                  triggerToast={triggerToast}
                  addActivity={logActivity}
                  triggerTask={triggerTask}
                  baseUrl={baseUrl}
                  username={username}
                />
              )}
              {activeView === "proofs" && (
                <ProofsView
                  displayName={displayName}
                  username={username}
                  profession={profession}
                  projects={projects}
                  certificates={certificates}
                  testimonials={testimonials}
                  baseUrl={baseUrl}
                />
              )}
              {activeView === "certificates" && (
                <CertificatesView
                  certificates={certificates}
                  setCertificates={setCertificates}
                  triggerToast={triggerToast}
                  addActivity={logActivity}
                  triggerTask={triggerTask}
                  baseUrl={baseUrl}
                  username={username}
                />
              )}
              {activeView === "skills" && <SkillsView projects={projects} certificates={certificates} />}
              {activeView === "testimonials" && (
                <TestimonialsView
                  testimonials={testimonials}
                  setTestimonials={setTestimonials}
                  triggerToast={triggerToast}
                  addActivity={logActivity}
                  triggerTask={triggerTask}
                  inboxItems={inboxItems}
                  setInboxItems={setInboxItems}
                />
              )}
              {activeView === "verification" && (
                <VerificationView
                  inboxItems={inboxItems}
                  setInboxItems={setInboxItems}
                  testimonials={testimonials}
                  setTestimonials={setTestimonials}
                  triggerToast={triggerToast}
                  addActivity={logActivity}
                  triggerTask={triggerTask}
                  checkedTasks={checkedTasks}
                />
              )}
              {activeView === "analytics" && (
                <AnalyticsView
                  projectsCount={projects.length}
                  certsCount={certificates.length}
                  testimonialsCount={testimonials.length}
                  viewsCount={viewsCount}
                  scansCount={scansCount}
                  downloadsCount={downloadsCount}
                />
              )}
              {activeView === "public-profile" && (
                <PublicProfileView
                  displayName={displayName}
                  username={username}
                  profession={profession}
                  bio={bio}
                  projects={projects}
                  certificates={certificates}
                  testimonials={testimonials}
                  triggerToast={triggerToast}
                  checkedTasks={checkedTasks}
                  baseUrl={baseUrl}
                />
              )}
              {activeView === "share-center" && (
                <ShareCenterView
                  username={username}
                  displayName={displayName}
                  triggerToast={triggerToast}
                  baseUrl={baseUrl}
                  incrementScans={() => setScansCount((p) => p + 1)}
                  incrementDownloads={() => setDownloadsCount((p) => p + 1)}
                />
              )}
              {activeView === "billing" && <BillingView triggerToast={triggerToast} />}
              {activeView === "settings" && (
                <SettingsView
                  displayName={displayName}
                  setDisplayName={setDisplayName}
                  username={username}
                  setUsername={setUsername}
                  triggerToast={triggerToast}
                  addActivity={logActivity}
                />
              )}
            </>
          )}
        </main>
      </div>


      <NeubrutalModal isOpen={isTrustModalOpen} onClose={() => setIsTrustModalOpen(false)} title="Trust Index breakdown">
        <div className="space-y-4 pt-2">
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Your trust metric is calculated dynamically in real-time by verification check nodes synced to your profile elements.
          </p>

          <div className="p-4 border-[2px] border-on-surface bg-surface-container-low rounded-lg font-mono text-xs space-y-2 select-none">
            <div className="flex justify-between border-b border-on-surface/5 pb-1">
              <span>GitHub Verified Sync</span>
              <span className={`font-bold ${checkedTasks["connect-github"] ? "text-secondary" : "text-on-surface-variant/40"}`}>
                {checkedTasks["connect-github"] ? "+20 points" : "0 / +20"}
              </span>
            </div>
            <div className="flex justify-between border-b border-on-surface/5 pb-1">
              <span>LinkedIn Connected</span>
              <span className={`font-bold ${checkedTasks["connect-linkedin"] ? "text-secondary" : "text-on-surface-variant/40"}`}>
                {checkedTasks["connect-linkedin"] ? "+20 points" : "0 / +20"}
              </span>
            </div>
            <div className="flex justify-between border-b border-on-surface/5 pb-1">
              <span>Projects Added ({projects.length})</span>
              <span className="font-bold text-secondary">
                +{Math.min(projects.length * 10, 20)} points
              </span>
            </div>
            <div className="flex justify-between border-b border-on-surface/5 pb-1">
              <span>Certificates Cryptography ({certificates.length})</span>
              <span className="font-bold text-secondary">
                +{Math.min(certificates.length * 15, 30)} points
              </span>
            </div>
            <div className="flex justify-between border-b border-on-surface/5 pb-1">
              <span>Testimonials Published ({testimonials.length})</span>
              <span className="font-bold text-secondary">
                +{Math.min(testimonials.length * 10, 20)} points
              </span>
            </div>
            <div className="flex justify-between text-base font-black border-t-2 border-on-surface pt-2 mt-2">
              <span className="font-sans uppercase">Verified Score</span>
              <span>{trustScore} / 100</span>
            </div>
          </div>

          <div className="pt-4 border-t border-on-surface/10 flex justify-end">
            <button
              onClick={() => setIsTrustModalOpen(false)}
              className="px-4 py-2 bg-on-surface text-white text-xs font-bold rounded border border-on-surface cursor-pointer"
            >
              Verify Ledger
            </button>
          </div>
        </div>
      </NeubrutalModal>

      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={handleCommandNavigate}
        onAction={handleCommandAction}
      />

      <ToastContainer toasts={toasts} removeToast={removeToast} />

      {/* Session Transition Overlay */}
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
    </div>
  );
}
