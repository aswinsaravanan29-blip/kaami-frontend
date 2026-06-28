"use client";

import React, { useState } from "react";
import NeubrutalButton from "../interactive-button";
import { NeubrutalModal, NeubrutalDrawer } from "./global-components";
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

// Helper for verified badges
const VerifiedBadge = () => (
  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-secondary-container text-on-secondary-container border border-on-surface rounded text-[9px] font-bold uppercase select-none">
    <span className="material-symbols-outlined text-[10px] font-bold">verified</span>
    Verified
  </span>
);

// --- 1. DASHBOARD HOME VIEW ---
interface DashboardHomeProps {
  displayName: string;
  username: string;
  profession: string;
  triggerToast: (msg: string, type: "success" | "error" | "info" | "sync") => void;
  checkedTasks: Record<string, any>;
  onToggleTask: (taskId: string) => void;
  openTrustModal: () => void;
  activities: any[];
  projectsCount: number;
  certsCount: number;
  testimonialsCount: number;
  trustScore: number;
  baseUrl: string;
  viewsCount: number;
  scansCount: number;
  downloadsCount: number;
}

export function DashboardHomeView({
  displayName,
  username,
  profession,
  triggerToast,
  checkedTasks,
  onToggleTask,
  openTrustModal,
  activities,
  projectsCount,
  certsCount,
  testimonialsCount,
  trustScore,
  baseUrl,
  viewsCount,
  scansCount,
  downloadsCount
}: DashboardHomeProps) {
  // Completion calculation
  const totalTasks = 9;
  const completedCount = Object.values(checkedTasks).filter(Boolean).length;
  const completionPercentage = Math.round((completedCount / totalTasks) * 100);

  const suggestedActions = [
    {
      id: "connect-github",
      label: "Connect GitHub Sync",
      desc: "Connect your GitHub account to sync commits and verify code skills.",
      badge: "+20 Trust Points",
      completed: checkedTasks["connect-github"],
      color: "bg-tertiary-fixed text-on-tertiary-fixed"
    },
    {
      id: "connect-linkedin",
      label: "Link LinkedIn Account",
      desc: "Pull verified work history, job roles, and corporate connections.",
      badge: "+20 Trust Points",
      completed: checkedTasks["connect-linkedin"],
      color: "bg-secondary-container text-on-secondary-container"
    },
    {
      id: "upload-resume",
      label: "Upload Resume PDF",
      desc: "Load your resume to extract raw skills and fill profile basics.",
      badge: "+8% Strength",
      completed: checkedTasks["upload-resume"],
      color: "bg-primary-fixed text-on-primary-fixed"
    }
  ];

  const handleTaskClick = (taskId: string, label: string) => {
    onToggleTask(taskId);
  };

  return (
    <div className="space-y-6">
      {/* Welcome status header */}
      <div className="bg-[#FFE5A3] border-[3px] border-on-surface p-4 sm:p-6 neubrutal-shadow-sm rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-3 md:gap-4 animate-fade-in">
        <div>
          <div className="font-label-caps text-xs text-on-surface-variant font-bold uppercase tracking-wider mb-1">
            System Node: Active
          </div>
          <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-black text-on-surface">
            Welcome, {displayName || "Builder"}
          </h2>
          <p className="font-mono text-[11px] sm:text-xs text-primary mt-1 leading-relaxed">
            <span className="text-on-surface-variant/80 font-bold block sm:inline sm:mr-1">Public identity:</span>
            {username ? (
              <a
                href={`http://${baseUrl}/${username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-bold hover:text-on-surface transition-colors break-all block sm:inline"
              >
                http://{baseUrl}/{username}
              </a>
            ) : (
              <span className="break-all block sm:inline">http://{baseUrl}/...</span>
            )}{" "}
            <span className="hidden sm:inline text-on-surface-variant/40 mx-1.5">•</span>
            <span className="block sm:inline text-on-surface-variant/60 mt-0.5 sm:mt-0 text-[10px] sm:text-xs font-sans sm:font-mono">
              (Click to preview live profile)
            </span>
          </p>
        </div>
        <div className="flex gap-2">
          <NeubrutalButton
            onClick={openTrustModal}
            className="px-4 py-2 bg-white text-on-surface text-xs font-bold border-[2px] border-on-surface rounded-lg flex items-center gap-1.5"
            shadowSize="sm"
          >
            <span className="material-symbols-outlined text-[16px] text-secondary font-bold">verified_user</span>
            Trust Score: {trustScore}/100
          </NeubrutalButton>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: checklist & suggestions */}
        <div className="lg:col-span-2 space-y-6">
          {/* PROFILE STRENGTH CHECKLIST */}
          <div className="bg-[#F0FFF4] border-[3px] border-on-surface p-6 neubrutal-shadow-sm rounded-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-headline-md text-lg font-black uppercase text-on-surface">
                Profile strength: {completionPercentage}%
              </h3>
              <span className="font-mono text-xs font-bold px-2 py-0.5 border-[2px] border-on-surface bg-white">
                {completedCount}/{totalTasks} Checked
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-white border-[2px] border-on-surface h-4 rounded-full overflow-hidden mb-6">
              <div
                className="bg-primary h-full transition-all duration-500 ease-out"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>

            {/* Checklist items */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { id: "add-photo", label: "Add profile photo" },
                { id: "connect-github", label: "Connect GitHub" },
                { id: "connect-linkedin", label: "Connect LinkedIn" },
                { id: "upload-resume", label: "Upload resume" },
                { id: "add-project", label: "Add first project" },
                { id: "add-certificate", label: "Add certificate" },
                { id: "add-experience", label: "Add experience" },
                { id: "publish-profile", label: "Publish profile" },
                { id: "share-profile", label: "Share profile" }
              ].map((task) => (
                <button
                  key={task.id}
                  onClick={() => handleTaskClick(task.id, task.label)}
                  className="flex items-center gap-3 p-3 border-[2px] border-on-surface rounded-lg bg-white hover:bg-slate-50 cursor-pointer select-none transition-colors w-full text-left"
                >
                  <div className={`w-5 h-5 border-[2px] border-on-surface rounded flex items-center justify-center shrink-0 transition-colors ${checkedTasks[task.id] ? "bg-secondary text-white border-secondary" : "bg-white"}`}>
                    {checkedTasks[task.id] && (
                      <span className="material-symbols-outlined text-[14px] font-black">check</span>
                    )}
                  </div>
                  <span className={`font-body-md text-[13px] font-bold ${checkedTasks[task.id] ? "line-through text-on-surface-variant/40 font-medium" : "text-on-surface"}`}>
                    {task.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* DYNAMIC SUGGESTED ACTION */}
          <div className="bg-[#F0F9FF] border-[3px] border-on-surface p-6 neubrutal-shadow-sm rounded-xl">
            <h3 className="font-headline-md text-lg font-black uppercase text-on-surface mb-4">
              Suggested Next Action
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {suggestedActions
                .filter((action) => !action.completed)
                .slice(0, 3)
                .map((action) => (
                  <div
                    key={action.id}
                    className="p-4 border-[2px] border-on-surface rounded-lg bg-white flex flex-col justify-between items-start gap-4"
                  >
                    <div>
                      <span className={`inline-block px-2 py-0.5 border border-on-surface rounded font-mono text-[9px] font-bold ${action.color} mb-2`}>
                        {action.badge}
                      </span>
                      <h4 className="font-headline-md text-[14px] font-black">{action.label}</h4>
                      <p className="text-[11px] text-on-surface-variant mt-1 leading-snug">{action.desc}</p>
                    </div>
                    <button
                      onClick={() => handleTaskClick(action.id, action.label)}
                      className="px-3 py-1 bg-on-surface text-white text-[11px] font-bold rounded border border-on-surface hover:bg-primary-container hover:text-on-primary-container cursor-pointer transition-colors"
                    >
                      Complete
                    </button>
                  </div>
                ))}
              {suggestedActions.filter((action) => !action.completed).length === 0 && (
                <div className="col-span-3 p-6 text-center border-[2px] border-dashed border-on-surface-variant/30 rounded-lg text-on-surface-variant font-bold text-sm bg-white">
                  🎯 Perfect! All suggestion targets met.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right column: activity feed & quick stats */}
        <div className="space-y-6">
          {/* RECENT ACTIVITY FEED */}
          <div className="bg-[#FAF5FF] border-[3px] border-on-surface p-6 neubrutal-shadow-sm rounded-xl flex flex-col h-full">
            <h3 className="font-headline-md text-lg font-black uppercase text-on-surface mb-4">
              Recent Activity Feed
            </h3>
            <div className="space-y-4 flex-1 max-h-[300px] overflow-y-auto pr-1">
              {activities.length === 0 ? (
                <div className="p-4 text-center text-on-surface-variant/50 font-bold text-xs bg-white border border-on-surface border-dashed rounded-lg">
                  No activity events registered yet.
                </div>
              ) : (
                activities.slice().reverse().map((act) => (
                  <div key={act.id} className="flex gap-3 items-start border-b border-on-surface/10 pb-3 last:border-b-0 last:pb-0">
                    <div className="w-8 h-8 rounded-full border-[2px] border-on-surface bg-white flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[16px] text-on-surface">
                        {act.type === "sync" ? "sync" : act.type === "success" ? "check" : "info"}
                      </span>
                    </div>
                    <div>
                      <p className="font-body-md text-[13px] font-bold text-on-surface leading-tight">
                        {act.text}
                      </p>
                      <span className="font-mono text-[10px] text-on-surface-variant/60 block mt-0.5">
                        {act.time}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* QUICK STATS */}
          <div className="bg-[#FFFBEB] border-[3px] border-on-surface p-6 neubrutal-shadow-sm rounded-xl">
            <h3 className="font-headline-md text-lg font-black uppercase text-on-surface mb-4">
              Real-Time Stats
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 border-[2px] border-on-surface bg-white rounded-lg">
                <span className="font-label-caps text-[9px] text-on-surface-variant font-bold block uppercase">Profile Views</span>
                <span className="font-mono text-xl font-bold">{viewsCount}</span>
              </div>
              <div className="p-3 border-[2px] border-on-surface bg-white rounded-lg">
                <span className="font-label-caps text-[9px] text-on-surface-variant font-bold block uppercase">QR Scans</span>
                <span className="font-mono text-xl font-bold">{scansCount}</span>
              </div>
              <div className="p-3 border-[2px] border-on-surface bg-white rounded-lg">
                <span className="font-label-caps text-[9px] text-on-surface-variant font-bold block uppercase">Exports</span>
                <span className="font-mono text-xl font-bold">{downloadsCount}</span>
              </div>
              <div className="p-3 border-[2px] border-on-surface bg-white rounded-lg">
                <span className="font-label-caps text-[9px] text-on-surface-variant font-bold block uppercase">Proofs Sync</span>
                <span className="font-mono text-xl font-bold">{projectsCount + certsCount + testimonialsCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- 2. PROFILE BUILDER VIEW ---
interface ProfileBuilderProps {
  displayName: string;
  username: string;
  bio: string;
  setBio: (val: string) => void;
  availability: string;
  setAvailability: (val: string) => void;
  triggerToast: (msg: string, type: any) => void;
  addActivity: (txt: string, type: string) => void;
  baseUrl: string;
  projectsCount: number;
}

export function ProfileBuilderView({
  displayName,
  username,
  bio,
  setBio,
  availability,
  setAvailability,
  triggerToast,
  addActivity,
  baseUrl,
  projectsCount
}: ProfileBuilderProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerSection, setDrawerSection] = useState("");
  const [tempBio, setTempBio] = useState(bio);
  const [tempAvailability, setTempAvailability] = useState(availability);

  const handleSave = () => {
    if (drawerSection === "Basic Info") {
      setBio(tempBio);
      addActivity(`Profile bio updated`, "info");
      triggerToast("Bio updated successfully.", "success");
    } else if (drawerSection === "Availability") {
      setAvailability(tempAvailability);
      addActivity(`Availability status set to ${tempAvailability.replace("-", " ")}`, "info");
      triggerToast("Availability status updated.", "success");
    }
    setIsDrawerOpen(false);
  };

  const openEdit = (section: string) => {
    setDrawerSection(section);
    if (section === "Basic Info") setTempBio(bio);
    if (section === "Availability") setTempAvailability(availability);
    setIsDrawerOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="font-display text-2xl font-black text-on-surface uppercase">Profile Builder</h2>
          <p className="font-body-sm text-on-surface-variant">Update the content blocks that feed into your verified identity card.</p>
        </div>
        <button
          onClick={() => openEdit("Availability")}
          className="px-4 py-2 bg-primary-container text-on-primary-container font-bold text-xs border-[2px] border-on-surface neubrutal-shadow-sm rounded cursor-pointer hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
        >
          Set Availability
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white border-[3px] border-on-surface p-6 neubrutal-shadow-sm rounded-xl space-y-4">
            <div className="flex justify-between items-start">
              <h3 className="font-headline-md text-lg font-black uppercase text-on-surface">Basic Information</h3>
              <button onClick={() => openEdit("Basic Info")} className="text-primary hover:underline font-bold text-xs cursor-pointer">
                Edit Bio
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-on-surface-variant/60 font-bold block uppercase text-[10px] tracking-wider">Display Name</span>
                <span className="font-bold">{displayName}</span>
              </div>
              <div>
                <span className="text-on-surface-variant/60 font-bold block uppercase text-[10px] tracking-wider">URL Slug</span>
                <span className="font-bold">/{username}</span>
              </div>
              <div className="col-span-2">
                <span className="text-on-surface-variant/60 font-bold block uppercase text-[10px] tracking-wider">Bio Statement</span>
                <p className="font-medium text-on-surface mt-1 leading-relaxed">{bio || "No bio added yet. Click edit to add."}</p>
              </div>
            </div>
          </div>

          {/* Social connections */}
          <div className="bg-white border-[3px] border-on-surface p-6 neubrutal-shadow-sm rounded-xl space-y-4">
            <h3 className="font-headline-md text-lg font-black uppercase text-on-surface">Verified Account Sync</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { platform: "GitHub", handle: username ? `github.com/${username}` : "Not Sync", synced: true },
                { platform: "LinkedIn", handle: username ? `linkedin.com/in/${username}` : "Not Sync", synced: true }
              ].map((soc, i) => (
                <div key={i} className="p-3 border-[2px] border-on-surface rounded-lg flex items-center justify-between bg-surface-container-low">
                  <div>
                    <span className="font-bold text-sm block">{soc.platform}</span>
                    <span className="font-mono text-xs text-on-surface-variant/60">{soc.handle}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[10px] bg-secondary-container px-2 py-0.5 rounded border border-on-surface font-bold uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                    Synced
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar: Availability status & live card */}
        <div className="space-y-6">
          <div className="bg-white border-[3px] border-on-surface p-6 neubrutal-shadow-sm rounded-xl space-y-4">
            <h3 className="font-headline-md text-lg font-black uppercase text-on-surface">Availability</h3>
            <div className="p-3 border-[2px] border-on-surface rounded bg-surface-container-low text-center">
              <span className="font-mono text-xs font-bold text-primary uppercase">
                {availability === "open-roles" ? "🟢 Open to Roles" : availability === "freelance" ? "🟡 Freelance / Consulting" : "🔴 Closed"}
              </span>
            </div>
          </div>

          <div className="bg-secondary-container border-[3px] border-on-surface p-6 neubrutal-shadow rounded-xl text-on-secondary-container">
            <h4 className="font-headline-md text-headline-md italic mb-4">Identity Card</h4>
            <div className="bg-white border-[2px] border-on-surface p-4 text-on-surface rounded-md">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-slate-900 border border-on-surface text-white flex items-center justify-center font-bold text-xs uppercase">
                    {displayName.charAt(0)}
                  </div>
                  <div>
                    <h5 className="font-bold text-xs leading-none">{displayName}</h5>
                    <span className="text-[9px] font-mono text-primary leading-none block mt-0.5">{baseUrl}/{username}</span>
                  </div>
                </div>
                <VerifiedBadge />
              </div>
              <p className="text-[10px] text-on-surface-variant font-bold leading-normal">
                {bio || "Setup your bio to preview..."}
              </p>
            </div>
          </div>
        </div>
      </div>

      <NeubrutalDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title={`Edit: ${drawerSection}`}>
        <div className="space-y-4 pt-4">
          {drawerSection === "Basic Info" && (
            <div>
              <label className="block font-label-caps text-[10px] font-bold uppercase mb-1">Bio Summary</label>
              <textarea
                value={tempBio}
                onChange={(e) => setTempBio(e.target.value)}
                rows={5}
                className="w-full border-[2px] border-on-surface p-2 bg-white rounded-md font-body-md focus:outline-none"
              />
            </div>
          )}

          {drawerSection === "Availability" && (
            <div>
              <label className="block font-label-caps text-[10px] font-bold uppercase mb-2">Availability Status</label>
              {["open-roles", "freelance", "closed"].map((opt) => (
                <label key={opt} className="flex items-center gap-2 p-2 border border-on-surface rounded mb-2 bg-white cursor-pointer">
                  <input
                    type="radio"
                    name="avail"
                    checked={tempAvailability === opt}
                    onChange={() => setTempAvailability(opt)}
                    className="w-4 h-4 text-primary focus:ring-0"
                  />
                  <span className="text-xs font-bold uppercase">{opt.replace("-", " ")}</span>
                </label>
              ))}
            </div>
          )}

          <div className="pt-6 border-t-2 border-on-surface/20 flex justify-end gap-3">
            <button onClick={() => setIsDrawerOpen(false)} className="px-4 py-2 border border-on-surface bg-white text-xs font-bold rounded cursor-pointer">
              Cancel
            </button>
            <button onClick={handleSave} className="px-4 py-2 bg-primary-container text-on-primary-container border-[2px] border-on-surface text-xs font-bold rounded neubrutal-shadow-sm cursor-pointer">
              Save Changes
            </button>
          </div>
        </div>
      </NeubrutalDrawer>
    </div>
  );
}

// --- 3. PROJECTS VIEW ---
interface ProjectsViewProps {
  projects: any[];
  setProjects: React.Dispatch<React.SetStateAction<any[]>>;
  triggerToast: (msg: string, type: any) => void;
  addActivity: (txt: string, type: string) => void;
  triggerTask: (taskId: string) => void;
  baseUrl: string;
  username: string;
  fetchProfileData?: () => Promise<void>;
}

export function ProjectsView({
  projects,
  setProjects,
  triggerToast,
  addActivity,
  triggerTask,
  baseUrl,
  username,
  fetchProfileData
}: ProjectsViewProps) {
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [filterYear, setFilterYear] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [tech, setTech] = useState("");
  const [link, setLink] = useState("");
  const [year, setYear] = useState("2026");

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !desc) {
      triggerToast("Please provide a title and description.", "error");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      triggerToast("Authentication token not found.", "error");
      return;
    }

    const techArray = tech.split(",").map((t) => t.trim()).filter(Boolean);
    const projectId = title.toLowerCase().replace(/\s+/g, "-");

    try {
      const res = await fetch(`${backendUrl}/api/profile/project`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          id: projectId,
          title,
          description: desc,
          tech: techArray.length > 0 ? techArray : ["Web"],
          link: link || "github.com",
          year
        })
      });

      if (!res.ok) {
        throw new Error("Failed to save project to registry");
      }

      if (fetchProfileData) {
        await fetchProfileData();
      } else {
        const newProj = {
          id: projectId,
          title,
          description: desc,
          tech: techArray.length > 0 ? techArray : ["Web"],
          stars: "0",
          forks: "0",
          visits: "0",
          proofCount: 1,
          link: link || "github.com",
          year,
          status: "Verified"
        };
        setProjects((prev) => [...prev, newProj]);
      }

      triggerTask("add-project");
      addActivity(`Project '${title}' added to proof ledger`, "success");
      triggerToast(`Project '${title}' published successfully!`, "success");

      // Reset form
      setTitle("");
      setDesc("");
      setTech("");
      setLink("");
      setIsAddModalOpen(false);
    } catch (err: any) {
      console.error(err);
      triggerToast(err.message || "Failed to publish project to server.", "error");
    }
  };

  const filtered = projects.filter((p) => filterYear === "all" || p.year === filterYear);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-white border-[3px] border-on-surface p-4 neubrutal-shadow-sm rounded-xl">
        <div className="flex flex-wrap gap-2 items-center">
          <span className="font-label-caps text-[11px] font-black uppercase text-on-surface-variant">Filter Year:</span>
          {["all", "2026", "2025", "2024"].map((y) => (
            <button
              key={y}
              onClick={() => setFilterYear(y)}
              className={`px-3 py-1 border border-on-surface rounded text-xs font-bold cursor-pointer ${
                filterYear === y ? "bg-primary-container text-on-primary-container" : "bg-white hover:bg-slate-50"
              }`}
            >
              {y === "all" ? "All" : y}
            </button>
          ))}
        </div>
        <div className="flex gap-2 items-center">
          <div className="flex border-[2px] border-on-surface rounded p-0.5 bg-surface-container-low shrink-0">
            <button
              onClick={() => setLayout("grid")}
              className={`w-7 h-7 flex items-center justify-center rounded cursor-pointer ${layout === "grid" ? "bg-white border border-on-surface" : ""}`}
            >
              <span className="material-symbols-outlined text-[16px]">grid_view</span>
            </button>
            <button
              onClick={() => setLayout("list")}
              className={`w-7 h-7 flex items-center justify-center rounded cursor-pointer ${layout === "list" ? "bg-white border border-on-surface" : ""}`}
            >
              <span className="material-symbols-outlined text-[16px]">view_list</span>
            </button>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3 py-1.5 bg-primary-container text-on-primary-container border-[2px] border-on-surface font-bold text-xs rounded cursor-pointer hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
          >
            Add Project
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border-[3px] border-on-surface p-8 neubrutal-shadow-sm rounded-xl text-center space-y-4">
          <span className="material-symbols-outlined text-[48px] text-on-surface-variant/40">folder_open</span>
          <h4 className="font-headline-md text-base font-black">No Projects Listed</h4>
          <p className="font-body-sm text-on-surface-variant">Click 'Add Project' to add your verified proof of build.</p>
        </div>
      ) : layout === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((proj) => (
            <div
              key={proj.id}
              onClick={() => setSelectedProject(proj)}
              className="bg-white border-[3px] border-on-surface neubrutal-shadow-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none cursor-pointer rounded-xl overflow-hidden flex flex-col justify-between transition-all"
            >
              <div>
                <div className={`h-20 w-full border-b-[2px] border-on-surface bg-on-surface/5 p-3 flex justify-between items-start`}>
                  <span className="font-mono text-[10px] text-on-surface bg-white border border-on-surface px-1.5 py-0.5 rounded font-bold">
                    {proj.year}
                  </span>
                  <VerifiedBadge />
                </div>
                <div className="p-4 space-y-1.5">
                  <h4 className="font-headline-md text-base font-black text-on-surface">{proj.title}</h4>
                  <p className="font-body-md text-xs text-on-surface-variant leading-normal line-clamp-2">
                    {proj.description || proj.desc}
                  </p>
                </div>
              </div>
              <div className="p-4 border-t border-on-surface/10 space-y-2">
                <div className="flex flex-wrap gap-1">
                  {proj.tech.map((t: string) => (
                    <span key={t} className="px-2 py-0.5 bg-slate-100 border border-on-surface rounded text-[9px] font-mono font-bold">
                      {t}
                    </span>
                  ))}
                </div>
                <div className="flex justify-between items-center text-[10px] font-mono text-on-surface-variant/70 pt-1 border-t border-on-surface/5">
                  <span>Stars: {proj.stars || proj.metrics?.stars || "0"}</span>
                  <span className="text-primary font-bold">Verified Details →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((proj) => (
            <div
              key={proj.id}
              onClick={() => setSelectedProject(proj)}
              className="bg-white border-[3px] border-on-surface p-4 neubrutal-shadow-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none cursor-pointer rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded border-[2px] border-on-surface bg-on-surface/5 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined">code</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-headline-md text-sm font-black">{proj.title}</h4>
                    <span className="font-mono text-[10px] text-on-surface-variant">{proj.year}</span>
                    <VerifiedBadge />
                  </div>
                  <p className="font-body-md text-xs text-on-surface-variant/80 mt-0.5 line-clamp-1">{proj.description || proj.desc}</p>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-surface-container-low border border-on-surface rounded font-mono text-[9px] font-bold self-end sm:self-auto">
                {proj.tech[0]}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Add Project Modal */}
      <NeubrutalModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Publish Project Proof">
        <form onSubmit={handleAddProject} className="space-y-4 pt-2">
          <div>
            <label className="block font-label-caps text-[10px] font-bold uppercase mb-1">Project Name</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Core Caching Router"
              className="w-full border-[2px] border-on-surface p-2 bg-white rounded focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block font-label-caps text-[10px] font-bold uppercase mb-1">Description</label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Describe what was built, how it acts as proof of skills..."
              rows={3}
              className="w-full border-[2px] border-on-surface p-2 bg-white rounded font-body-md focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block font-label-caps text-[10px] font-bold uppercase mb-1">Tech Stack (comma separated)</label>
            <input
              type="text"
              value={tech}
              onChange={(e) => setTech(e.target.value)}
              placeholder="Rust, Actix, WebAssembly"
              className="w-full border-[2px] border-on-surface p-2 bg-white rounded focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-label-caps text-[10px] font-bold uppercase mb-1">Repository Link</label>
              <input
                type="text"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="github.com/username/project"
                className="w-full border-[2px] border-on-surface p-2 bg-white rounded focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-label-caps text-[10px] font-bold uppercase mb-1">Year</label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full border-[2px] border-on-surface p-2 bg-white rounded focus:outline-none"
              >
                <option value="2026">2026</option>
                <option value="2025">2025</option>
                <option value="2024">2024</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-on-surface/10 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 border border-on-surface bg-white text-xs font-bold rounded"
            >
              Cancel
            </button>
            <NeubrutalButton
              type="submit"
              className="px-4 py-2 bg-primary-container text-on-primary-container border-[2px] border-on-surface text-xs font-bold rounded"
              shadowSize="sm"
            >
              Publish Proof
            </NeubrutalButton>
          </div>
        </form>
      </NeubrutalModal>

      {/* Project details modal */}
      <NeubrutalModal isOpen={!!selectedProject} onClose={() => setSelectedProject(null)} title={selectedProject?.title || ""}>
        {selectedProject && (
          <div className="space-y-4 pt-2">
            <div className="p-3 bg-surface-container-low border-[2px] border-on-surface rounded font-body-sm text-xs leading-relaxed text-on-surface-variant">
              {selectedProject.description || selectedProject.desc}
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-2 border border-on-surface rounded">
                <span className="text-[9px] text-on-surface-variant font-bold uppercase block">Year</span>
                <span className="font-bold">{selectedProject.year}</span>
              </div>
              <div className="p-2 border border-on-surface rounded">
                <span className="text-[9px] text-on-surface-variant font-bold uppercase block">Verification status</span>
                <span className="font-bold text-secondary">Verified Ledger</span>
              </div>
            </div>
            <div>
              <span className="font-label-caps text-[9px] text-on-surface-variant font-bold uppercase block mb-1">Tech Stack</span>
              <div className="flex flex-wrap gap-1">
                {selectedProject.tech.map((t: string) => (
                  <span key={t} className="px-2 py-0.5 bg-white border border-on-surface rounded text-[10px] font-mono font-bold">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-on-surface/10">
              <span className="font-mono text-[10px] text-primary truncate max-w-[200px]">
                {baseUrl}/{username}/project/{selectedProject.id}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    triggerToast("Project link copied!", "success");
                    setSelectedProject(null);
                  }}
                  className="px-3 py-1 bg-white border border-on-surface font-bold text-xs rounded cursor-pointer"
                >
                  Copy URL
                </button>
                <button
                  onClick={() => {
                    const targetLink = selectedProject.link || selectedProject.liveLink || "github.com";
                    window.open(targetLink.startsWith("http") ? targetLink : `https://${targetLink}`, "_blank");
                    setSelectedProject(null);
                  }}
                  className="px-3 py-1 bg-secondary-container border border-on-surface font-bold text-xs rounded cursor-pointer"
                >
                  Visit Code
                </button>
              </div>
            </div>
          </div>
        )}
      </NeubrutalModal>
    </div>
  );
}

// --- 4. PROOFS VIEW ---
interface ProofsProps {
  displayName: string;
  username: string;
  profession: string;
  projects: any[];
  certificates: any[];
  testimonials: any[];
  baseUrl: string;
  experiences: any[];
  fetchProfileData: () => Promise<void>;
  triggerToast: (msg: string, type: any) => void;
  addActivity: (txt: string, type: string) => void;
  triggerTask: (taskId: string) => void;
}

export function ProofsView({
  displayName,
  username,
  profession,
  projects,
  certificates,
  testimonials,
  baseUrl,
  experiences,
  fetchProfileData,
  triggerToast,
  addActivity,
  triggerTask
}: ProofsProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [timePeriod, setTimePeriod] = useState("");
  const [description, setDescription] = useState("");
  const [evidenceStr, setEvidenceStr] = useState("");

  const categories = [
    { id: "all", label: "All Evidence" },
    { id: "experience", label: "Work Experience" },
    { id: "opensource", label: "Open Source" },
    { id: "certificate", label: "Certificates" },
    { id: "testimonial", label: "Endorsements" }
  ];

  const handleSaveExperience = async () => {
    if (!role || !company || !timePeriod) {
      triggerToast("Role, company, and period are required.", "error");
      return;
    }

    const evidence = evidenceStr ? evidenceStr.split(",").map(e => e.trim()) : [];
    const token = localStorage.getItem("token");
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

    try {
      const res = await fetch(`${backendUrl}/api/profile/experience`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ role, company, timePeriod, description, evidence })
      });

      if (res.ok) {
        triggerToast("Experience logged successfully!", "success");
        addActivity(`Added experience node: ${role} at ${company}`, "success");
        triggerTask("add-experience");
        
        setRole("");
        setCompany("");
        setTimePeriod("");
        setDescription("");
        setEvidenceStr("");
        setIsFormOpen(false);
        
        await fetchProfileData();
      } else {
        triggerToast("Failed to save experience node", "error");
      }
    } catch (err) {
      console.error(err);
      triggerToast("Connection error", "error");
    }
  };

  const handleDeleteExperience = async (id: number) => {
    const token = localStorage.getItem("token");
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

    try {
      const res = await fetch(`${backendUrl}/api/profile/experience/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (res.ok) {
        triggerToast("Experience node removed", "success");
        addActivity("Removed experience node", "info");
        await fetchProfileData();
      } else {
        triggerToast("Failed to delete experience", "error");
      }
    } catch (err) {
      console.error(err);
      triggerToast("Connection error", "error");
    }
  };

  const dynamicProofs: any[] = [];

  experiences.forEach((exp) => {
    dynamicProofs.push({
      id: exp.id,
      isRealExperience: true,
      category: "experience",
      title: exp.role,
      institution: exp.company,
      time: exp.time_period,
      desc: exp.description,
      evidence: exp.evidence || []
    });
  });

  projects.forEach((proj) => {
    dynamicProofs.push({
      category: "opensource",
      title: proj.title,
      institution: proj.liveLink || "GitHub Sync",
      time: proj.year,
      desc: proj.description,
      evidence: proj.tech || []
    });
  });

  certificates.forEach((cert) => {
    dynamicProofs.push({
      category: "certificate",
      title: cert.title,
      institution: cert.issuer,
      time: cert.issue_date,
      desc: `Cryptographically verified credential ID: ${cert.credential_id || "N/A"}.`,
      evidence: ["Verified response credentials token"]
    });
  });

  testimonials.forEach((test) => {
    dynamicProofs.push({
      category: "testimonial",
      title: `Endorsement from ${test.author}`,
      institution: test.role,
      time: "2026",
      desc: `"${test.quote}"`,
      evidence: ["Peer verification signature", "Signed metadata hash"]
    });
  });

  const filtered = dynamicProofs.filter((p) => activeCategory === "all" || p.category === activeCategory);

  return (
    <div className="space-y-6">
      <div className="bg-white border-[3px] border-on-surface p-4 neubrutal-shadow-sm rounded-xl overflow-x-auto">
        <div className="flex gap-2 min-w-max">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1 border-[2px] border-on-surface rounded-full text-xs font-bold cursor-pointer transition-colors ${
                activeCategory === cat.id ? "bg-primary-container text-on-primary-container" : "bg-white hover:bg-slate-50"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* EXPERIENCE ENTRY FORM CARD */}
      <div className="bg-[#FFE5A3] border-[3px] border-on-surface p-5 neubrutal-shadow-sm rounded-xl">
        <div className="flex justify-between items-center flex-wrap gap-3">
          <div>
            <h3 className="font-headline-md text-base font-black uppercase text-on-surface">Experience Ledger</h3>
            <p className="font-body-sm text-[11px] text-on-surface-variant">Log real employment work evidence nodes to increase verified trust.</p>
          </div>
          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="px-4 py-2 bg-primary-container text-on-primary-container font-bold text-xs border-[2px] border-on-surface rounded neubrutal-shadow-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all cursor-pointer"
          >
            {isFormOpen ? "Cancel" : "+ Add Experience Node"}
          </button>
        </div>

        {isFormOpen && (
          <div className="mt-4 pt-4 border-t-2 border-on-surface/10 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-label-caps text-[10px] text-on-surface-variant font-bold uppercase mb-1">Role / Job Title</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Senior Software Engineer"
                  className="w-full border-[2px] border-on-surface p-2 bg-white font-mono text-xs rounded focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-label-caps text-[10px] text-on-surface-variant font-bold uppercase mb-1">Company / Organization</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Google DeepMind"
                  className="w-full border-[2px] border-on-surface p-2 bg-white font-mono text-xs rounded focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-label-caps text-[10px] text-on-surface-variant font-bold uppercase mb-1">Time Period</label>
                <input
                  type="text"
                  value={timePeriod}
                  onChange={(e) => setTimePeriod(e.target.value)}
                  placeholder="e.g. 2024 - Present"
                  className="w-full border-[2px] border-on-surface p-2 bg-white font-mono text-xs rounded focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-label-caps text-[10px] text-on-surface-variant font-bold uppercase mb-1">Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detail your responsibilities and verified project footprints..."
                className="w-full border-[2px] border-on-surface p-2 bg-white font-sans text-xs rounded focus:outline-none resize-none"
              />
            </div>

            <div>
              <label className="block font-label-caps text-[10px] text-on-surface-variant font-bold uppercase mb-1">Verification Evidence Links (comma-separated)</label>
              <input
                type="text"
                value={evidenceStr}
                onChange={(e) => setEvidenceStr(e.target.value)}
                placeholder="e.g. Employment Contract, Manager Endorsement Link"
                className="w-full border-[2px] border-on-surface p-2 bg-white font-mono text-xs rounded focus:outline-none"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleSaveExperience}
                className="px-5 py-2.5 bg-secondary-container text-on-secondary-container font-black text-xs border-[2px] border-on-surface rounded neubrutal-shadow-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all cursor-pointer"
              >
                Commit Experience Node
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="relative border-l-[3px] border-on-surface ml-4 pl-8 space-y-6 py-4">
        {filtered.length === 0 ? (
          <div className="font-mono text-xs text-on-surface-variant italic">No evidence records logged in this category.</div>
        ) : (
          filtered.map((proof, i) => (
            <div key={i} className="relative">
              <div className="absolute -left-[45px] top-1.5 w-7 h-7 rounded-full border-[2px] border-on-surface bg-white flex items-center justify-center">
                <span className="material-symbols-outlined text-[14px]">
                  {proof.category === "experience" ? "badge" : proof.category === "opensource" ? "code" : "verified"}
                </span>
              </div>

              <div className="bg-white border-[3px] border-on-surface p-5 neubrutal-shadow-sm rounded-xl space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h4 className="font-headline-md text-sm font-black">{proof.title}</h4>
                    <span className="text-[11px] text-on-surface-variant font-bold">{proof.institution} • {proof.time}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {proof.isRealExperience && (
                      <button
                        onClick={() => handleDeleteExperience(proof.id)}
                        className="p-1 hover:text-error text-on-surface-variant transition-colors cursor-pointer flex items-center justify-center"
                        title="Delete Experience Node"
                      >
                        <span className="material-symbols-outlined text-[16px] font-bold">delete</span>
                      </button>
                    )}
                    <VerifiedBadge />
                  </div>
                </div>
                {proof.desc && <p className="text-xs text-on-surface-variant leading-relaxed">{proof.desc}</p>}
                {proof.evidence && proof.evidence.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-on-surface/5 mt-2">
                    {proof.evidence.map((ev: string, idx: number) => (
                      <span key={idx} className="px-2 py-0.5 bg-slate-100 border border-on-surface rounded text-[9.5px] font-mono font-bold text-on-surface-variant/80">
                        ✓ {ev}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// --- 5. CERTIFICATES VIEW ---
interface CertificatesProps {
  certificates: any[];
  setCertificates: React.Dispatch<React.SetStateAction<any[]>>;
  triggerToast: (msg: string, type: any) => void;
  addActivity: (txt: string, type: string) => void;
  triggerTask: (taskId: string) => void;
  baseUrl: string;
  username: string;
  fetchProfileData?: () => Promise<void>;
}

export function CertificatesView({
  certificates,
  setCertificates,
  triggerToast,
  addActivity,
  triggerTask,
  baseUrl,
  username,
  fetchProfileData
}: CertificatesProps) {
  const [search, setSearch] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState<any>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [issuer, setIssuer] = useState("");
  const [credId, setCredId] = useState("");
  const [date, setDate] = useState("June 2026");
  const [fileUrl, setFileUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadCertFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const token = localStorage.getItem("token");
    if (!token) {
      triggerToast("Authentication token not found.", "error");
      return;
    }

    setIsUploading(true);
    triggerToast("Uploading proof document...", "info");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${backendUrl}/api/upload`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });

      if (!res.ok) {
        throw new Error("Upload failed");
      }

      const data = await res.json();
      setFileUrl(data.secure_url);
      triggerToast("Proof document uploaded successfully!", "success");
    } catch (err) {
      console.error(err);
      triggerToast("Failed to upload proof document.", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddCert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !issuer) {
      triggerToast("Title and Issuer are required.", "error");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      triggerToast("Authentication token not found.", "error");
      return;
    }

    const certificateId = title.toLowerCase().replace(/\s+/g, "-");
    const generatedCredId = credId || `KM-CERT-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      const res = await fetch(`${backendUrl}/api/profile/certificate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          id: certificateId,
          title,
          issuer,
          credId: generatedCredId,
          date,
          fileUrl: fileUrl || null
        })
      });

      if (!res.ok) {
        throw new Error("Failed to save certificate proof");
      }

      if (fetchProfileData) {
        await fetchProfileData();
      } else {
        const newCert = {
          id: certificateId,
          title,
          issuer,
          date,
          credential_id: generatedCredId,
          file_url: fileUrl || null,
          verified: true
        };
        setCertificates((prev) => [...prev, newCert]);
      }

      triggerTask("add-certificate");
      addActivity(`Certificate '${title}' synced with verified status`, "success");
      triggerToast(`Certificate '${title}' successfully synced!`, "success");

      // Reset Form
      setTitle("");
      setIssuer("");
      setCredId("");
      setFileUrl("");
      setIsAddOpen(false);
    } catch (err: any) {
      console.error(err);
      triggerToast(err.message || "Failed to link certificate.", "error");
    }
  };

  const filtered = certificates.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.issuer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-stretch gap-4 bg-white border-[3px] border-on-surface p-4 neubrutal-shadow-sm rounded-xl">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search certificates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border-[2px] border-on-surface p-2.5 pl-9 bg-white font-body-md rounded focus:outline-none text-xs"
          />
          <span className="material-symbols-outlined text-[16px] text-on-surface-variant/40 absolute left-3 top-3.5">
            search
          </span>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2 bg-primary-container text-on-primary-container border-[2px] border-on-surface font-bold text-xs rounded cursor-pointer hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
        >
          Add Certificate
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border-[3px] border-on-surface p-8 neubrutal-shadow-sm rounded-xl text-center space-y-4">
          <span className="material-symbols-outlined text-[48px] text-on-surface-variant/40">workspace_premium</span>
          <h4 className="font-headline-md text-base font-black">No Certificates</h4>
          <p className="font-body-sm text-on-surface-variant">Add certificates to display verified credentials on your profile.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((cert) => (
            <div
              key={cert.id}
              onClick={() => setSelectedCert(cert)}
              className="bg-white border-[3px] border-on-surface p-5 neubrutal-shadow-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none cursor-pointer rounded-xl flex flex-col justify-between transition-all"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="material-symbols-outlined text-[32px] text-primary">workspace_premium</span>
                  <VerifiedBadge />
                </div>
                <h4 className="font-headline-md text-sm font-black text-on-surface leading-tight">{cert.title}</h4>
                <p className="text-[11px] font-bold text-on-surface-variant/70 mt-1">{cert.issuer}</p>
              </div>
              <div className="border-t border-on-surface/10 pt-3 mt-4 flex justify-between items-center text-[10px] font-mono text-on-surface-variant/60">
                <span>Issued: {cert.date}</span>
                <span className="font-bold text-primary">Details →</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Cert Modal */}
      <NeubrutalModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Link Certificate Proof">
        <form onSubmit={handleAddCert} className="space-y-4 pt-2">
          <div>
            <label className="block font-label-caps text-[10px] font-bold uppercase mb-1">Certificate Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. AWS Solutions Architect"
              className="w-full border-[2px] border-on-surface p-2 bg-white rounded focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="block font-label-caps text-[10px] font-bold uppercase mb-1">Issuer Authority</label>
            <input
              type="text"
              value={issuer}
              onChange={(e) => setIssuer(e.target.value)}
              placeholder="e.g. Amazon Web Services"
              className="w-full border-[2px] border-on-surface p-2 bg-white rounded focus:outline-none"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-label-caps text-[10px] font-bold uppercase mb-1">Credential ID</label>
              <input
                type="text"
                value={credId}
                onChange={(e) => setCredId(e.target.value)}
                placeholder="e.g. AWS-SA-9912"
                className="w-full border-[2px] border-on-surface p-2 bg-white rounded focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-label-caps text-[10px] font-bold uppercase mb-1">Issue Date</label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="June 2026"
                className="w-full border-[2px] border-on-surface p-2 bg-white rounded focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-label-caps text-[10px] font-bold uppercase mb-1">Attachment Proof (Image or PDF)</label>
            <div className="flex gap-3 items-center">
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={handleUploadCertFile}
                disabled={isUploading}
                className="hidden"
                id="cert-file-upload"
              />
              <label
                htmlFor="cert-file-upload"
                className={`px-4 py-2 border-[2px] border-on-surface bg-white text-on-surface text-xs font-bold rounded cursor-pointer hover:bg-slate-50 transition-colors inline-flex items-center gap-1.5 ${
                  isUploading ? "opacity-50 pointer-events-none" : ""
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">upload_file</span>
                {isUploading ? "Uploading..." : "Choose File"}
              </label>
              {fileUrl && (
                <div className="flex items-center gap-1.5 font-mono text-[10px] text-secondary font-bold">
                  <span className="material-symbols-outlined text-[14px]">check_circle</span>
                  Uploaded!
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-on-surface/10 flex justify-end gap-2">
            <button type="button" onClick={() => setIsAddOpen(false)} className="px-4 py-2 border border-on-surface bg-white text-xs font-bold rounded">
              Cancel
            </button>
            <NeubrutalButton type="submit" className="px-4 py-2 bg-primary-container text-on-primary-container border-[2px] border-on-surface text-xs font-bold rounded" shadowSize="sm">
              Link Certificate
            </NeubrutalButton>
          </div>
        </form>
      </NeubrutalModal>

      {/* Cert details modal */}
      <NeubrutalModal isOpen={!!selectedCert} onClose={() => setSelectedCert(null)} title="Verified Credentials">
        {selectedCert && (
          <div className="space-y-4 pt-2">
            <div className="aspect-[4/3] bg-slate-900 border-[3px] border-on-surface text-white rounded-lg flex flex-col justify-between p-5 relative overflow-hidden select-none">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary-container opacity-20 blur-xl rounded-full"></div>
              <div className="flex justify-between items-start">
                <span className="font-display font-black text-xs italic tracking-widest text-primary-container uppercase">
                  KAAMI PLATFORM PROOF
                </span>
                <span className="material-symbols-outlined text-[32px] text-tertiary-fixed">workspace_premium</span>
              </div>
              <div className="text-center space-y-1 z-10">
                <h5 className="font-headline-md text-base font-black text-[#FFF9E6]">{selectedCert.title}</h5>
                <p className="text-[10px] text-slate-300 font-medium">Successfully Synced via {selectedCert.issuer}</p>
              </div>
              <div className="flex justify-between items-end text-[9px] font-mono text-slate-400">
                <div>
                  <div>ID: {selectedCert.credId}</div>
                  <div>Issued: {selectedCert.date}</div>
                </div>
                <div className="w-10 h-10 bg-white p-1 border border-on-surface rounded">
                  <svg viewBox="0 0 100 100" className="w-full h-full text-black">
                    <rect width="30" height="30" />
                    <rect x="70" width="30" height="30" />
                    <rect y="70" width="30" height="30" />
                    <rect x="40" y="40" width="20" height="20" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-2 border-[2px] border-on-surface bg-white rounded">
                <span className="text-[9px] text-on-surface-variant font-bold block uppercase mb-0.5">Credential ID</span>
                <span className="font-bold">{selectedCert.credId}</span>
              </div>
              <div className="p-2 border-[2px] border-on-surface bg-white rounded">
                <span className="text-[9px] text-on-surface-variant font-bold block uppercase mb-0.5">Verification status</span>
                <span className="font-bold text-secondary flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">check_circle</span>
                  Verified Signature
                </span>
              </div>
            </div>

            {selectedCert.file_url && (
              <div className="p-3 border-[2px] border-on-surface bg-white rounded font-mono text-xs space-y-1">
                <span className="text-[9px] text-on-surface-variant font-bold block uppercase">Attachment Proof</span>
                <a
                  href={selectedCert.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-black text-primary underline hover:text-primary/80 inline-flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                  View Credential Document
                </a>
              </div>
            )}

            <div className="flex justify-between items-center pt-4 border-t border-on-surface/10">
              <span className="font-mono text-[9px] text-primary truncate max-w-[200px]">
                {baseUrl}/{username}/certificate/{selectedCert.id}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    triggerToast("Certificate Link Copied!", "success");
                    setSelectedCert(null);
                  }}
                  className="px-3 py-1 bg-white border border-on-surface font-bold text-xs rounded cursor-pointer"
                >
                  Share Link
                </button>
                <button
                  onClick={() => {
                    setSelectedCert(null);
                  }}
                  className="px-3 py-1 bg-secondary-container border border-on-surface font-bold text-xs rounded cursor-pointer"
                >
                  Verify Source
                </button>
              </div>
            </div>
          </div>
        )}
      </NeubrutalModal>
    </div>
  );
}

// --- 6. SKILLS VIEW ---
interface SkillsProps {
  projects: any[];
  certificates: any[];
}

export function SkillsView({ projects, certificates }: SkillsProps) {
  // Extract dynamic skills based on Tech Stack in Projects!
  const frontendSkills: any[] = [
    { name: "HTML5 / CSS3", level: 90, sources: ["Profile Onboarding", "Static Layouts"] }
  ];
  const backendSkills: any[] = [];

  // Deduplicate and aggregate evidence counts
  const techMap: Record<string, { count: number; sources: string[] }> = {};

  projects.forEach((proj) => {
    proj.tech.forEach((t: string) => {
      if (!techMap[t]) {
        techMap[t] = { count: 0, sources: [] };
      }
      techMap[t].count += 1;
      techMap[t].sources.push(`Project: '${proj.title}'`);
    });
  });

  certificates.forEach((cert) => {
    // Add issuer to evidence sources if title matches keyword
    const key = cert.title.toLowerCase();
    if (key.includes("aws") || key.includes("cloud")) {
      if (!techMap["Cloud Architecture"]) techMap["Cloud Architecture"] = { count: 0, sources: [] };
      techMap["Cloud Architecture"].count += 1;
      techMap["Cloud Architecture"].sources.push(`Cert: '${cert.title}' via ${cert.issuer}`);
    } else if (key.includes("rust")) {
      if (!techMap["Rust"]) techMap["Rust"] = { count: 0, sources: [] };
      techMap["Rust"].count += 1;
      techMap["Rust"].sources.push(`Cert: '${cert.title}'`);
    } else if (key.includes("kubernetes") || key.includes("kube")) {
      if (!techMap["Kubernetes"]) techMap["Kubernetes"] = { count: 0, sources: [] };
      techMap["Kubernetes"].count += 1;
      techMap["Kubernetes"].sources.push(`Cert: '${cert.title}'`);
    }
  });

  // Distribute skills between Frontend and Backend lists
  Object.keys(techMap).forEach((name) => {
    const info = techMap[name];
    const skillObj = {
      name,
      level: Math.min(60 + info.count * 10, 98),
      proofCount: info.count,
      sources: Array.from(new Set(info.sources))
    };

    const fnKeywords = ["react", "tailwind", "next", "typescript", "javascript", "css", "html", "design", "a11y", "frontend"];
    const isFrontend = fnKeywords.some((key) => name.toLowerCase().includes(key));
    if (isFrontend) {
      frontendSkills.push(skillObj);
    } else {
      backendSkills.push(skillObj);
    }
  });

  return (
    <div className="space-y-6">
      {/* Frontend Column */}
      <div className="space-y-4">
        <h3 className="font-headline-md text-base font-black uppercase text-on-surface border-b-[2px] border-on-surface pb-1.5">
          Frontend & Interface Engineering
        </h3>
        {frontendSkills.length === 0 ? (
          <p className="text-xs text-on-surface-variant font-bold italic">No frontend evidence registered yet. Add projects or certs.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {frontendSkills.map((s, idx) => (
              <div key={idx} className="bg-white border-[3px] border-on-surface p-4 neubrutal-shadow-sm rounded-xl space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-headline-md text-sm font-black flex items-center gap-1.5">
                      {s.name}
                      <VerifiedBadge />
                    </h4>
                    <span className="text-[10px] text-on-surface-variant mt-0.5 block">
                      Evidence Index: {s.proofCount || 1} Sync Event(s)
                    </span>
                  </div>
                  <span className="font-mono text-xs font-black text-primary">{s.level}%</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 border border-on-surface rounded-full overflow-hidden">
                  <div className="bg-secondary h-full" style={{ width: `${s.level}%` }}></div>
                </div>
                <div className="space-y-1 pt-1.5 border-t border-on-surface/5">
                  <span className="font-label-caps text-[9px] text-on-surface-variant font-bold uppercase block">Evidence logs:</span>
                  <div className="flex flex-wrap gap-1">
                    {s.sources.map((src: string) => (
                      <span key={src} className="px-1.5 py-0.5 bg-slate-50 border border-on-surface rounded text-[9.5px] font-bold text-on-surface-variant/80">
                        • {src}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Backend Column */}
      <div className="space-y-4">
        <h3 className="font-headline-md text-base font-black uppercase text-on-surface border-b-[2px] border-on-surface pb-1.5">
          Systems & Backend Engineering
        </h3>
        {backendSkills.length === 0 ? (
          <div className="p-4 text-center border-[2px] border-dashed border-on-surface-variant/30 rounded-lg text-on-surface-variant font-bold text-xs">
            No systems evidence registered yet. Synced commits or certs will populate here automatically.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {backendSkills.map((s, idx) => (
              <div key={idx} className="bg-white border-[3px] border-on-surface p-4 neubrutal-shadow-sm rounded-xl space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-headline-md text-sm font-black flex items-center gap-1.5">
                      {s.name}
                      <VerifiedBadge />
                    </h4>
                    <span className="text-[10px] text-on-surface-variant mt-0.5 block">
                      Evidence Index: {s.proofCount} Sync Event(s)
                    </span>
                  </div>
                  <span className="font-mono text-xs font-black text-primary">{s.level}%</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 border border-on-surface rounded-full overflow-hidden">
                  <div className="bg-secondary h-full" style={{ width: `${s.level}%` }}></div>
                </div>
                <div className="space-y-1 pt-1.5 border-t border-on-surface/5">
                  <span className="font-label-caps text-[9px] text-on-surface-variant font-bold uppercase block">Evidence logs:</span>
                  <div className="flex flex-wrap gap-1">
                    {s.sources.map((src: string) => (
                      <span key={src} className="px-1.5 py-0.5 bg-slate-50 border border-on-surface rounded text-[9.5px] font-bold text-on-surface-variant/80">
                        • {src}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// --- 7. TESTIMONIALS VIEW ---
interface TestimonialsProps {
  testimonials: any[];
  setTestimonials: React.Dispatch<React.SetStateAction<any[]>>;
  triggerToast: (msg: string, type: any) => void;
  addActivity: (txt: string, type: string) => void;
  triggerTask: (taskId: string) => void;
  inboxItems: any[];
  setInboxItems: React.Dispatch<React.SetStateAction<any[]>>;
}

export function TestimonialsView({
  testimonials,
  setTestimonials,
  triggerToast,
  addActivity,
  triggerTask,
  inboxItems,
  setInboxItems
}: TestimonialsProps) {
  const [isRequestOpen, setIsRequestOpen] = useState(false);

  // Form states
  const [author, setAuthor] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [quote, setQuote] = useState("");

  const handleRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author || !quote) {
      triggerToast("Endorser Name and Testimonial Quote are required.", "error");
      return;
    }

    // Submit to verification inbox as PENDING!
    const newInbox = {
      id: Math.floor(1000 + Math.random() * 9000),
      type: "Testimonial Endorsement",
      requester: `${author} (${role || "Manager"})`,
      details: quote,
      status: "Pending",
      timestamp: "Today, Just Now"
    };

    setInboxItems((prev) => [...prev, newInbox]);
    addActivity(`Endorsement request dispatched to ${author}`, "info");
    triggerToast(`Request sent to ${author}! Approve it in 'Verification -> Proof Inbox' to publish.`, "success");

    // Reset Form
    setAuthor("");
    setEmail("");
    setRole("");
    setQuote("");
    setIsRequestOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white border-[3px] border-on-surface p-4 neubrutal-shadow-sm rounded-xl">
        <div>
          <h3 className="font-headline-md text-base font-black uppercase text-on-surface">Endorsements Ledger</h3>
          <p className="text-xs text-on-surface-variant">Manage external proof notes and testimonial cards.</p>
        </div>
        <button
          onClick={() => setIsRequestOpen(true)}
          className="px-4 py-2 bg-primary-container text-on-primary-container border-[2px] border-on-surface font-bold text-xs rounded cursor-pointer hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
        >
          Request Testimonial
        </button>
      </div>

      {testimonials.length === 0 ? (
        <div className="bg-white border-[3px] border-on-surface p-8 neubrutal-shadow-sm rounded-xl text-center space-y-4">
          <span className="material-symbols-outlined text-[48px] text-on-surface-variant/40">rate_review</span>
          <h4 className="font-headline-md text-base font-black">No testimonials verified</h4>
          <p className="font-body-sm text-on-surface-variant">Request endorsements from managers or clients to verify your achievements.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-white border-[3px] border-on-surface p-5 neubrutal-shadow-sm rounded-xl flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="material-symbols-outlined text-[24px] text-tertiary">format_quote</span>
                  <VerifiedBadge />
                </div>
                <p className="text-xs italic text-on-surface leading-relaxed">
                  "{t.quote}"
                </p>
              </div>
              <div className="border-t border-on-surface/10 pt-2.5">
                <span className="font-bold text-xs block text-on-surface">{t.author}</span>
                <span className="text-[10px] text-on-surface-variant/60 block">{t.role}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Request Modal */}
      <NeubrutalModal isOpen={isRequestOpen} onClose={() => setIsRequestOpen(false)} title="Request Testimonial Verification">
        <form onSubmit={handleRequest} className="space-y-4 pt-2">
          <div>
            <label className="block font-label-caps text-[10px] font-bold uppercase mb-1">Endorser Name</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="e.g. Sarah Jenkins"
              className="w-full border-[2px] border-on-surface p-2 bg-white rounded focus:outline-none"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-label-caps text-[10px] font-bold uppercase mb-1">Role / Company</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Engineering Director"
                className="w-full border-[2px] border-on-surface p-2 bg-white rounded focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-label-caps text-[10px] font-bold uppercase mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. sarah@company.com"
                className="w-full border-[2px] border-on-surface p-2 bg-white rounded focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block font-label-caps text-[10px] font-bold uppercase mb-1">Endorsement Note</label>
            <textarea
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder="Paste a recommendation or describe what was achieved..."
              rows={3}
              className="w-full border-[2px] border-on-surface p-2 bg-white rounded font-body-md focus:outline-none"
              required
            />
          </div>

          <div className="pt-4 border-t border-on-surface/10 flex justify-end gap-2">
            <button type="button" onClick={() => setIsRequestOpen(false)} className="px-4 py-2 border border-on-surface bg-white text-xs font-bold rounded">
              Cancel
            </button>
            <NeubrutalButton type="submit" className="px-4 py-2 bg-primary-container text-on-primary-container border-[2px] border-on-surface text-xs font-bold rounded" shadowSize="sm">
              Send Request
            </NeubrutalButton>
          </div>
        </form>
      </NeubrutalModal>
    </div>
  );
}

// --- 8. VERIFICATION CENTER (WITH PROOF INBOX NESTED) ---
interface VerificationProps {
  inboxItems: any[];
  setInboxItems: React.Dispatch<React.SetStateAction<any[]>>;
  testimonials: any[];
  setTestimonials: React.Dispatch<React.SetStateAction<any[]>>;
  triggerToast: (msg: string, type: any) => void;
  addActivity: (txt: string, type: string) => void;
  triggerTask: (taskId: string) => void;
  checkedTasks: Record<string, boolean>;
}

export function VerificationView({
  inboxItems,
  setInboxItems,
  testimonials,
  setTestimonials,
  triggerToast,
  addActivity,
  triggerTask,
  checkedTasks
}: VerificationProps) {
  const [activeTab, setActiveTab] = useState<"identity" | "employment" | "skill" | "cert" | "inbox">("identity");

  const handleInboxAction = (id: number, action: "Approved" | "Rejected") => {
    // Locate item
    const targetItem = inboxItems.find((i) => i.id === id);
    if (!targetItem) return;

    // Update status in inbox list
    setInboxItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: action } : item))
    );

    if (action === "Approved") {
      // Add to testimonials list if it was an endorsement request!
      if (targetItem.type.includes("Testimonial")) {
        const words = targetItem.requester.split("(");
        const name = words[0].trim();
        const role = words[1] ? words[1].replace(")", "").trim() : "Manager";

        const newTest = {
          author: name,
          role,
          quote: targetItem.details,
          verified: true
        };
        setTestimonials((prev) => [...prev, newTest]);
        triggerTask("share-profile"); // Complete testimonial task
        addActivity(`Endorsement by ${name} approved and published`, "success");
      }
      triggerToast(`Proof approved and published to profile.`, "success");
    } else {
      addActivity(`Verification request from ${targetItem.requester} rejected`, "info");
      triggerToast(`Verification request rejected.`, "info");
    }
  };

  const pendingCount = inboxItems.filter((i) => i.status === "Pending").length;

  return (
    <div className="space-y-6">
      {/* Subnavigation */}
      <div className="bg-white border-[3px] border-on-surface p-1.5 neubrutal-shadow-sm rounded-xl flex flex-wrap gap-1">
        {[
          { id: "identity", label: "Identity Check" },
          { id: "employment", label: "Employment" },
          { id: "skill", label: "Skills Validation" },
          { id: "cert", label: "Certs Sync" },
          { id: "inbox", label: `Proof Inbox (${pendingCount})` }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-1.5 border-[2px] border-transparent font-bold text-xs rounded-md cursor-pointer transition-all ${
              activeTab === tab.id
                ? "bg-on-surface text-white border-on-surface"
                : "hover:bg-slate-50 text-on-surface-variant"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white border-[3px] border-on-surface p-6 neubrutal-shadow-sm rounded-xl">
        {activeTab === "identity" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-headline-md text-base font-black uppercase text-on-surface">Identity Verification</h3>
              <VerifiedBadge />
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Your profile is verified through cryptographical secure signatures (ECDSA Secp256k1) bound to your OAuth logins.
            </p>
            <div className="p-3 bg-surface-container-low border border-on-surface rounded font-mono text-[10.5px] space-y-1 select-none">
              <div className="flex justify-between">
                <span>Authority Signer</span>
                <span>GitHub Verification Proxy</span>
              </div>
              <div className="flex justify-between">
                <span>Signature Registry</span>
                <span>ECDSA SHA-256 Hash</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "employment" && (
          <div className="space-y-4">
            <h3 className="font-headline-md text-base font-black uppercase text-on-surface">Employment Verification</h3>
            <p className="text-xs text-on-surface-variant">Invite reference checks or connect payroll APIs (Gusto, ADP) to certify roles.</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border-[2px] border-on-surface bg-surface-container-low rounded-lg flex flex-col justify-between items-start gap-4">
                <div>
                  <h4 className="font-bold text-xs uppercase">Connect Payroll Sync</h4>
                  <p className="text-[10px] text-on-surface-variant mt-1 leading-snug">Pull verified company, tenure, and title details instantly.</p>
                </div>
                <button
                  onClick={() => {
                    triggerTask("add-experience");
                    addActivity("Payroll API connected successfully", "success");
                    triggerToast("Payroll API connected. 1 job verified.", "success");
                  }}
                  className="px-3 py-1 bg-on-surface text-white text-[11px] font-bold border border-on-surface rounded cursor-pointer"
                >
                  Link Payroll API
                </button>
              </div>
              <div className="p-4 border-[2px] border-on-surface bg-surface-container-low rounded-lg flex flex-col justify-between items-start gap-4">
                <div>
                  <h4 className="font-bold text-xs uppercase">Manual Email Verification</h4>
                  <p className="text-[10px] text-on-surface-variant mt-1 leading-snug">Dispatched an employer check to verify corporate roles.</p>
                </div>
                <button
                  onClick={() => triggerToast("Reference validator opened.", "info")}
                  className="px-3 py-1 bg-white border border-on-surface text-[11px] font-bold rounded cursor-pointer"
                >
                  Invite Validator
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "skill" && (
          <div className="space-y-4">
            <h3 className="font-headline-md text-base font-black uppercase text-on-surface">Skills Verification Engine</h3>
            <p className="text-xs text-on-surface-variant">Validate technical competencies through GitHub commit keys and repository analysis.</p>
            <div className="p-4 border-[2px] border-on-surface bg-surface-container-low rounded-lg space-y-3">
              <h4 className="font-bold text-xs uppercase">Commit Authenticator Sync</h4>
              <p className="text-[11px] text-on-surface-variant/80 leading-normal">
                Verifies GPG signed commit ratios and language frequencies across linked projects to generate skill indices.
              </p>
              <button
                onClick={() => {
                  triggerToast("Syncing all public repositories...", "sync");
                  setTimeout(() => {
                    triggerToast("Skills validation synchronized successfully.", "success");
                  }, 1200);
                }}
                className="px-4 py-1.5 bg-secondary-container text-on-secondary-container border-[2px] border-on-surface font-bold text-xs rounded cursor-pointer"
              >
                Trigger Sync Check
              </button>
            </div>
          </div>
        )}

        {activeTab === "cert" && (
          <div className="space-y-4">
            <h3 className="font-headline-md text-base font-black uppercase text-on-surface">Certificates Verification</h3>
            <p className="text-xs text-on-surface-variant">Validate cert achievements via digital credential registry pipelines (Credly, AWS).</p>
            <div className="p-4 border-[2px] border-on-surface bg-surface-container-low rounded-lg space-y-3">
              <h4 className="font-bold text-xs uppercase">Credly Gateway Sync</h4>
              <p className="text-[11px] text-on-surface-variant/80 leading-normal">Connect your Credly account to import verified badges automatically.</p>
              <button
                onClick={() => {
                  triggerToast("Connecting Credly sync API...", "sync");
                  setTimeout(() => {
                    triggerToast("Credly account sync successful.", "success");
                  }, 1200);
                }}
                className="px-4 py-1.5 bg-primary-container text-on-primary-container border-[2px] border-on-surface font-bold text-xs rounded cursor-pointer"
              >
                Connect Credly
              </button>
            </div>
          </div>
        )}

        {activeTab === "inbox" && (
          <div className="space-y-4">
            <h3 className="font-headline-md text-base font-black uppercase text-on-surface">Proof Inbox</h3>
            <p className="text-xs text-on-surface-variant">Accept or discard verification requests and peer endorsement submissions.</p>

            <div className="space-y-3">
              {inboxItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 border-[2px] border-on-surface rounded-lg bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="font-bold text-xs text-on-surface">{item.type}</span>
                      <span className="font-mono text-[9px] bg-slate-100 border border-on-surface px-1.5 py-0.5 rounded font-bold uppercase">
                        {item.requester}
                      </span>
                    </div>
                    <p className="text-[11px] text-on-surface-variant leading-snug">{item.details}</p>
                    <span className="font-mono text-[9px] text-on-surface-variant/50 block">{item.timestamp}</span>
                  </div>

                  <div className="flex gap-2 self-end sm:self-auto shrink-0">
                    {item.status === "Pending" ? (
                      <>
                        <button
                          onClick={() => handleInboxAction(item.id, "Rejected")}
                          className="px-3 py-1 bg-white border border-on-surface text-on-surface hover:bg-error-container hover:text-on-error-container text-[11px] font-bold rounded cursor-pointer"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleInboxAction(item.id, "Approved")}
                          className="px-3 py-1 bg-secondary-container text-on-secondary-container border border-on-surface text-[11px] font-bold rounded cursor-pointer"
                        >
                          Approve & Publish
                        </button>
                      </>
                    ) : (
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold font-mono border border-on-surface ${
                        item.status === "Approved" ? "bg-secondary-container text-on-secondary-container" : "bg-error-container text-on-error-container"
                      }`}>
                        {item.status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {inboxItems.length === 0 && (
                <div className="p-4 text-center text-on-surface-variant/50 font-bold text-xs">
                  Your inbox queue is empty.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// --- 9. ANALYTICS VIEW ---
interface AnalyticsProps {
  projectsCount: number;
  certsCount: number;
  testimonialsCount: number;
  viewsCount: number;
  scansCount: number;
  downloadsCount: number;
}

export function AnalyticsView({
  projectsCount,
  certsCount,
  testimonialsCount,
  viewsCount,
  scansCount,
  downloadsCount
}: AnalyticsProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border-[3px] border-on-surface p-4 neubrutal-shadow-sm rounded-xl">
          <span className="font-label-caps text-[9px] text-on-surface-variant font-black block uppercase">Profile Views</span>
          <span className="font-mono text-3xl font-black text-on-surface">{viewsCount}</span>
          <span className="text-[10px] text-secondary font-bold block mt-1">↑ Active recruiter traffic</span>
        </div>
        <div className="bg-white border-[3px] border-on-surface p-4 neubrutal-shadow-sm rounded-xl">
          <span className="font-label-caps text-[9px] text-on-surface-variant font-black block uppercase">QR Code Scans</span>
          <span className="font-mono text-3xl font-black text-on-surface">{scansCount}</span>
          <span className="text-[10px] text-secondary font-bold block mt-1">↑ Mobile checks</span>
        </div>
        <div className="bg-white border-[3px] border-on-surface p-4 neubrutal-shadow-sm rounded-xl">
          <span className="font-label-caps text-[9px] text-on-surface-variant font-black block uppercase">Resume Exports</span>
          <span className="font-mono text-3xl font-black text-on-surface">{downloadsCount}</span>
          <span className="text-[10px] text-on-surface-variant font-bold block mt-1">Steady download metrics</span>
        </div>
        <div className="bg-white border-[3px] border-on-surface p-4 neubrutal-shadow-sm rounded-xl">
          <span className="font-label-caps text-[9px] text-on-surface-variant font-black block uppercase">Peers Verified</span>
          <span className="font-mono text-3xl font-black text-on-surface">{projectsCount + certsCount + testimonialsCount}</span>
          <span className="text-[10px] text-secondary font-bold block mt-1">Total verified records</span>
        </div>
      </div>

      {/* SVG Traffic Chart */}
      <div className="bg-white border-[3px] border-on-surface p-6 neubrutal-shadow-sm rounded-xl">
        <h3 className="font-headline-md text-lg font-black uppercase text-on-surface mb-4">Traffic Stream</h3>
        <div className="w-full h-48 bg-surface-container-low border-[2px] border-on-surface rounded-lg relative p-4 overflow-hidden">
          <svg className="w-full h-full text-primary" viewBox="0 0 400 100" preserveAspectRatio="none">
            <line x1="0" y1="20" x2="400" y2="20" stroke="#1c1b1b" strokeWidth="0.5" strokeDasharray="3" opacity="0.1" />
            <line x1="0" y1="50" x2="400" y2="50" stroke="#1c1b1b" strokeWidth="0.5" strokeDasharray="3" opacity="0.1" />
            <line x1="0" y1="80" x2="400" y2="80" stroke="#1c1b1b" strokeWidth="0.5" strokeDasharray="3" opacity="0.1" />
            <path
              d="M 0 90 Q 50 20 100 70 T 200 10 T 300 80 T 400 30"
              fill="none"
              stroke="#ab3500"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="M 0 90 Q 50 20 100 70 T 200 10 T 300 80 T 400 30 L 400 100 L 0 100 Z"
              fill="url(#gradient)"
              opacity="0.15"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ab3500" />
                <stop offset="100%" stopColor="#ab3500" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute bottom-2 left-4 text-[9px] font-mono text-on-surface-variant/60">Mon</div>
          <div className="absolute bottom-2 left-1/4 text-[9px] font-mono text-on-surface-variant/60">Wed</div>
          <div className="absolute bottom-2 left-2/4 text-[9px] font-mono text-on-surface-variant/60">Fri</div>
          <div className="absolute bottom-2 left-3/4 text-[9px] font-mono text-on-surface-variant/60">Sun</div>
        </div>
      </div>
    </div>
  );
}

// --- 10. PUBLIC PROFILE WORKSPACE (SIMULATOR) ---
interface PublicProfileProps {
  displayName: string;
  username: string;
  profession: string;
  bio: string;
  projects: any[];
  certificates: any[];
  testimonials: any[];
  triggerToast: (msg: string, type: any) => void;
  checkedTasks: Record<string, boolean>;
  baseUrl: string;
}

export function PublicProfileView({
  displayName,
  username,
  profession,
  bio,
  projects,
  certificates,
  testimonials,
  triggerToast,
  checkedTasks,
  baseUrl
}: PublicProfileProps) {
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [visibility, setVisibility] = useState("public");
  const [accent, setAccent] = useState("#ab3500");
  const [sections, setSections] = useState([
    "Projects", "Certificates", "Testimonials"
  ]);
  const [isEmptyPreview, setIsEmptyPreview] = useState(false);

  const moveUp = (idx: number) => {
    if (idx === 0) return;
    const newSecs = [...sections];
    const temp = newSecs[idx];
    newSecs[idx] = newSecs[idx - 1];
    newSecs[idx - 1] = temp;
    setSections(newSecs);
    triggerToast("Layout order updated.", "success");
  };

  const moveDown = (idx: number) => {
    if (idx === sections.length - 1) return;
    const newSecs = [...sections];
    const temp = newSecs[idx];
    newSecs[idx] = newSecs[idx + 1];
    newSecs[idx + 1] = temp;
    setSections(newSecs);
    triggerToast("Layout order updated.", "success");
  };

  const viewportWidth = {
    desktop: "w-full",
    tablet: "w-[768px]",
    mobile: "w-[375px]"
  };

  // Profile Strength Calculation
  const totalTasks = 9;
  const completedCount = Object.values(checkedTasks).filter(Boolean).length;
  const completionPercentage = Math.round((completedCount / totalTasks) * 100);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 bg-white border-[3px] border-on-surface p-4 neubrutal-shadow-sm rounded-xl">
        <div className="space-y-1">
          <span className="font-label-caps text-[9px] text-on-surface-variant font-bold uppercase">Visibility Status</span>
          <div className="flex gap-1.5">
            {["public", "private", "recruiter"].map((v) => (
              <button
                key={v}
                onClick={() => {
                  setVisibility(v);
                  triggerToast(`Visibility status set to ${v}.`, "success");
                }}
                className={`px-2 py-1 border border-on-surface rounded text-[10px] font-bold uppercase cursor-pointer ${
                  visibility === v ? "bg-primary-container text-on-primary-container" : "bg-white hover:bg-slate-50"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1">
          <span className="font-label-caps text-[9px] text-on-surface-variant font-bold uppercase">Accent Color</span>
          <div className="flex gap-2 items-center">
            {["#ab3500", "#006b5b", "#705d00", "#1c1b1b"].map((c) => (
              <button
                key={c}
                onClick={() => setAccent(c)}
                className={`w-6 h-6 border-[2px] border-on-surface rounded-full cursor-pointer transition-transform ${
                  accent === c ? "scale-110 ring-2 ring-primary" : ""
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        <div className="space-y-1">
          <span className="font-label-caps text-[9px] text-on-surface-variant font-bold uppercase">Viewport</span>
          <div className="flex gap-1">
            {["desktop", "tablet", "mobile"].map((v) => (
              <button
                key={v}
                onClick={() => setViewport(v as any)}
                className={`px-2 py-1 border border-on-surface rounded text-[10px] font-bold uppercase cursor-pointer ${
                  viewport === v ? "bg-secondary-container text-on-secondary-container" : "bg-white"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center">
          <label className="flex items-center gap-2 font-bold text-xs select-none cursor-pointer">
            <input
              type="checkbox"
              checked={isEmptyPreview}
              onChange={(e) => setIsEmptyPreview(e.target.checked)}
              className="w-4 h-4 text-primary border-on-surface focus:ring-0 cursor-pointer"
            />
            <span>Mock Empty State Preview</span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Reordering column */}
        <div className="bg-white border-[3px] border-on-surface p-4 neubrutal-shadow-sm rounded-xl space-y-4">
          <h4 className="font-headline-md text-sm font-black uppercase text-on-surface pb-1.5 border-b border-on-surface/20">
            Reorder sections
          </h4>
          <div className="space-y-2">
            {sections.map((sec, idx) => (
              <div
                key={sec}
                className="p-2 border-[2px] border-on-surface rounded bg-surface-container-low flex justify-between items-center text-xs font-bold"
              >
                <span>{sec}</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => moveUp(idx)}
                    disabled={idx === 0}
                    className="w-5 h-5 flex items-center justify-center border border-on-surface rounded hover:bg-slate-200 disabled:opacity-30 cursor-pointer"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveDown(idx)}
                    disabled={idx === sections.length - 1}
                    className="w-5 h-5 flex items-center justify-center border border-on-surface rounded hover:bg-slate-200 disabled:opacity-30 cursor-pointer"
                  >
                    ↓
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Viewport Frame */}
        <div className="lg:col-span-3 flex justify-center bg-slate-900 border-[3px] border-on-surface p-4 rounded-xl max-w-full overflow-x-auto min-h-[450px]">
          <div className={`${viewportWidth[viewport]} bg-[#FFF9E6] border-[3px] border-on-surface rounded-lg p-6 text-on-surface transition-all duration-300`}>
            {isEmptyPreview ? (
              <div className="flex flex-col items-center justify-center text-center p-8 space-y-4 min-h-[300px]">
                <span className="text-[48px] animate-pulse">🏗️</span>
                <h3 className="font-display text-xl font-black uppercase text-on-surface">
                  Profile currently being built
                </h3>
                <p className="font-body-sm text-on-surface-variant max-w-md">
                  {displayName} is building and verifying their credentials on the Kaami Ledger protocol.
                </p>
                <div className="w-full max-w-xs bg-white border-[2px] border-on-surface p-3 rounded font-mono text-[10px] space-y-1.5 text-left select-none">
                  <div className="flex justify-between">
                    <span>Ledger Registry Strength</span>
                    <span>{completionPercentage}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Identity Status</span>
                    <span className="text-secondary font-bold">Secure Signature Synced</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => triggerToast("Updates Subscribed!", "success")}
                    className="px-4 py-2 bg-on-surface text-white font-bold text-xs border border-on-surface rounded cursor-pointer"
                  >
                    Follow Profile Updates
                  </button>
                  <button
                    onClick={() => triggerToast("Launch Notification registered!", "success")}
                    className="px-4 py-2 bg-white text-on-surface font-bold text-xs border-[2px] border-on-surface rounded cursor-pointer"
                  >
                    Notify when launched
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-on-surface/20 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full border-[2px] border-on-surface bg-white overflow-hidden text-center flex items-center justify-center font-bold text-base">
                      {displayName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-headline-md text-base font-black leading-none">{displayName}</h4>
                      <span className="font-mono text-[9px] block mt-0.5" style={{ color: accent }}>
                        {baseUrl}/{username}
                      </span>
                    </div>
                  </div>
                  <VerifiedBadge />
                </div>

                <p className="text-xs font-medium text-on-surface-variant leading-relaxed">
                  {bio || "Setup your bio statement in Profile Builder..."}
                </p>

                {/* Render Reorderable Sections with Real Data */}
                <div className="space-y-4 pt-2">
                  {sections.map((sec) => (
                    <div key={sec} className="space-y-2">
                      <span className="font-label-caps text-[9px] font-black uppercase text-on-surface-variant block border-b border-on-surface/5 pb-1">
                        {sec}
                      </span>
                      {sec === "Projects" && (
                        <div className="space-y-2">
                          {projects.map((proj) => (
                            <div key={proj.id} className="p-3 border-[2px] border-on-surface bg-white rounded-md flex justify-between items-center">
                              <div>
                                <span className="font-bold text-xs">{proj.title}</span>
                                <span className="font-mono text-[9px] text-on-surface-variant block mt-0.5">{proj.tech.join(", ")}</span>
                              </div>
                              <span className="font-mono text-[9px] text-primary">{proj.year}</span>
                            </div>
                          ))}
                          {projects.length === 0 && <p className="text-[10px] italic text-on-surface-variant/50">No projects added yet.</p>}
                        </div>
                      )}
                      {sec === "Certificates" && (
                        <div className="space-y-2">
                          {certificates.map((cert) => (
                            <div key={cert.id} className="p-3 border-[2px] border-on-surface bg-white rounded-md flex justify-between items-center">
                              <div>
                                <span className="font-bold text-xs">{cert.title}</span>
                                <span className="text-[9px] text-on-surface-variant block mt-0.5">{cert.issuer}</span>
                              </div>
                              <span className="font-mono text-[9px] text-primary">{cert.date}</span>
                            </div>
                          ))}
                          {certificates.length === 0 && <p className="text-[10px] italic text-on-surface-variant/50">No certificates linked yet.</p>}
                        </div>
                      )}
                      {sec === "Testimonials" && (
                        <div className="space-y-2">
                          {testimonials.map((test, idx) => (
                            <div key={idx} className="p-3 border-[2px] border-on-surface bg-white rounded-md">
                              <p className="text-[10px] italic text-on-surface-variant">"{test.quote}"</p>
                              <span className="text-[9px] font-bold text-on-surface block mt-1">— {test.author} ({test.role})</span>
                            </div>
                          ))}
                          {testimonials.length === 0 && <p className="text-[10px] italic text-on-surface-variant/50">No endorsements verified yet.</p>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- 11. SHARE CENTER ---
interface ShareCenterProps {
  username: string;
  displayName: string;
  triggerToast: (msg: string, type: any) => void;
  baseUrl: string;
  incrementScans: () => void;
  incrementDownloads: () => void;
}

export function ShareCenterView({
  username,
  displayName,
  triggerToast,
  baseUrl,
  incrementScans,
  incrementDownloads
}: ShareCenterProps) {
  const emailSig = `<table>
  <tr>
    <td style="font-family: sans-serif; font-size: 14px; font-weight: bold; color: #1c1b1b;">
      ${displayName}
    </td>
  </tr>
  <tr>
    <td style="font-family: monospace; font-size: 11px; color: #ab3500;">
      Verified Proof: ${baseUrl}/${username}
    </td>
  </tr>
</table>`;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border-[3px] border-on-surface p-6 neubrutal-shadow-sm rounded-xl space-y-4">
            <h3 className="font-headline-md text-lg font-black uppercase text-on-surface">Share URL Registry</h3>
            <div className="space-y-3">
              <div>
                <label className="block font-label-caps text-[10px] text-on-surface-variant font-bold uppercase mb-1">
                  Public profile URL
                </label>
                <div className="flex gap-2">
                  <div className="flex-1 border-[2px] border-on-surface p-2.5 bg-slate-50 font-mono text-xs rounded truncate">
                    {baseUrl}/{username}
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${baseUrl}/${username}`);
                      triggerToast("Public profile link copied!", "success");
                    }}
                    className="px-4 py-2 bg-primary-container text-on-primary-container text-xs font-bold border-[2px] border-on-surface rounded cursor-pointer"
                  >
                    Copy
                  </button>
                </div>
              </div>

              {/* Only primary profile URL form is needed */}
            </div>
          </div>

          <div className="bg-white border-[3px] border-on-surface p-6 neubrutal-shadow-sm rounded-xl space-y-4">
            <h3 className="font-headline-md text-lg font-black uppercase text-on-surface">Email Signature Preview</h3>
            <div className="border-[2px] border-on-surface p-4 rounded bg-[#fcf9f8] space-y-3">
              <div className="border-l-[3px] border-primary pl-3 py-1 font-sans">
                <div className="font-bold text-sm text-[#1c1b1b]">{displayName}</div>
                <div className="text-[11px] text-on-surface-variant/80">Verified Builder Node</div>
                <div className="text-[11px] font-mono font-bold text-primary mt-1">✓ Verified Profile: {baseUrl}/{username}</div>
              </div>
              <textarea
                value={emailSig}
                readOnly
                rows={4}
                className="w-full border-[2px] border-on-surface p-2 bg-white rounded font-mono text-[11px] focus:outline-none"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(emailSig);
                  triggerToast("Email signature copied to clipboard!", "success");
                }}
                className="px-3 py-1.5 bg-on-surface text-white text-xs font-bold rounded border border-on-surface cursor-pointer"
              >
                Copy Signature HTML
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border-[3px] border-on-surface p-6 neubrutal-shadow-sm rounded-xl space-y-4">
            <h3 className="font-headline-md text-lg font-black uppercase text-on-surface">Card Preview</h3>
            <div className="aspect-[1.75] bg-[#FFF9E6] border-[3px] border-on-surface rounded-xl p-4 flex flex-col justify-between neubrutal-shadow-sm relative overflow-hidden select-none">
              <div>
                <h4 className="font-headline-md text-sm font-black">{displayName}</h4>
                <span className="text-[8px] font-mono text-on-surface-variant block uppercase tracking-wider">Verified Builder Node</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="font-mono text-[10px] text-primary font-bold">{baseUrl}/{username}</span>
                <div className="w-10 h-10 border border-on-surface bg-white p-0.5 rounded">
                  <svg viewBox="0 0 100 100" className="w-full h-full text-black">
                    <rect width="30" height="30" />
                    <rect x="70" width="30" height="30" />
                    <rect y="70" width="30" height="30" />
                    <rect x="40" y="40" width="20" height="20" />
                  </svg>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                incrementDownloads();
                triggerToast("Asset download started.", "success");
              }}
              className="w-full py-2 bg-secondary-container text-on-secondary-container text-xs font-bold border-[2px] border-on-surface rounded-lg text-center cursor-pointer"
            >
              Download PDF / SVG Card
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- 12. BILLING ---
export function BillingView({ triggerToast }: { triggerToast: (msg: string, type: any) => void }) {
  return (
    <div className="space-y-6">
      <div className="bg-white border-[3px] border-on-surface p-6 neubrutal-shadow-sm rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="font-mono text-[10px] bg-secondary-container border border-on-surface px-2 py-0.5 rounded font-bold uppercase">
            Active Tier
          </span>
          <h3 className="font-headline-md text-xl font-black uppercase text-on-surface mt-2">Kaami Pro Builder</h3>
          <p className="text-xs text-on-surface-variant mt-1">Unlimited cryptographical verifications, custom domain, and analytics reporting.</p>
        </div>
        <div className="text-right shrink-0">
          <span className="font-mono text-2xl font-black text-on-surface">$12/mo</span>
          <span className="text-[10px] text-on-surface-variant block mt-0.5">Next billing: July 28, 2026</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border-[3px] border-on-surface p-6 neubrutal-shadow-sm rounded-xl space-y-4">
          <h3 className="font-headline-md text-lg font-black uppercase text-on-surface">Usage Limits</h3>
          <div className="space-y-4 font-mono text-xs">
            <div className="space-y-1">
              <div className="flex justify-between font-bold">
                <span>Verifications (This Month)</span>
                <span>48 / 100</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 border border-on-surface rounded-full overflow-hidden">
                <div className="bg-primary h-full w-[48%]"></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border-[3px] border-on-surface p-6 neubrutal-shadow-sm rounded-xl space-y-4">
          <h3 className="font-headline-md text-lg font-black uppercase text-on-surface">Invoice History</h3>
          <div className="space-y-2 font-mono text-xs">
            {[
              { id: "INV-004", date: "June 28, 2026", amt: "$12.00", status: "Paid" },
              { id: "INV-003", date: "May 28, 2026", amt: "$12.00", status: "Paid" }
            ].map((inv) => (
              <div key={inv.id} className="flex justify-between items-center border-b border-on-surface/10 pb-2 last:border-b-0 last:pb-0">
                <div>
                  <span className="font-bold block">{inv.id}</span>
                  <span className="text-[10px] text-on-surface-variant/60">{inv.date}</span>
                </div>
                <div className="flex gap-4 items-center">
                  <span className="font-bold">{inv.amt}</span>
                  <span className="px-2 py-0.5 bg-secondary-container border border-on-surface rounded text-[10px] font-bold uppercase">
                    {inv.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- 13. SETTINGS ---
interface SettingsProps {
  displayName: string;
  setDisplayName: (val: string) => void;
  username: string;
  setUsername: (val: string) => void;
  triggerToast: (msg: string, type: any) => void;
  addActivity: (txt: string, type: string) => void;
}

export function SettingsView({
  displayName,
  setDisplayName,
  username,
  setUsername,
  triggerToast,
  addActivity
}: SettingsProps) {
  const [activeSub, setActiveSub] = useState("account");
  const [tempName, setTempName] = useState(displayName);
  const [tempUsername, setTempUsername] = useState(username);

  const handleUpdate = () => {
    if (!tempName || !tempUsername) {
      triggerToast("Name and username are required.", "error");
      return;
    }
    setDisplayName(tempName);
    setUsername(tempUsername.toLowerCase().replace(/[^a-z0-9-_]/g, ""));
    addActivity(`Account configurations updated: '${tempName}'`, "info");
    triggerToast("Settings updated successfully.", "success");
  };

  return (
    <div className="bg-white border-[3px] border-on-surface neubrutal-shadow-sm rounded-xl overflow-hidden flex flex-col md:flex-row min-h-[400px]">
      <div className="md:w-1/4 bg-[#FFF9E6] border-b-[3px] md:border-b-0 md:border-r-[3px] border-on-surface p-4 space-y-1">
        {[
          { id: "account", label: "Account Setup", icon: "person" },
          { id: "security", label: "Security & Sessions", icon: "shield" }
        ].map((sub) => (
          <button
            key={sub.id}
            onClick={() => setActiveSub(sub.id)}
            className={`w-full text-left p-3 border-[2px] border-transparent font-bold text-xs rounded-md flex items-center gap-2 cursor-pointer transition-all ${
              activeSub === sub.id ? "bg-on-surface text-white border-on-surface" : "hover:bg-white/50 text-on-surface-variant"
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">{sub.icon}</span>
            <span>{sub.label}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 p-6 space-y-6 bg-white">
        {activeSub === "account" && (
          <div className="space-y-4">
            <h4 className="font-headline-md text-base font-black uppercase text-on-surface pb-1.5 border-b border-on-surface/20">
              Account Setup
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-label-caps text-[10px] font-bold uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="w-full border-[2px] border-on-surface p-2 bg-white rounded focus:outline-none"
                />
              </div>
              <div>
                <label className="block font-label-caps text-[10px] font-bold uppercase mb-1">Username Slug</label>
                <input
                  type="text"
                  value={tempUsername}
                  onChange={(e) => setTempUsername(e.target.value)}
                  className="w-full border-[2px] border-on-surface p-2 bg-white rounded font-mono focus:outline-none"
                />
              </div>
            </div>
            <div className="pt-4 flex justify-end">
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-primary-container text-on-primary-container border-[2px] border-on-surface text-xs font-bold rounded neubrutal-shadow-sm cursor-pointer"
              >
                Update Configuration
              </button>
            </div>
          </div>
        )}

        {activeSub === "security" && (
          <div className="space-y-4">
            <h4 className="font-headline-md text-base font-black uppercase text-on-surface pb-1.5 border-b border-on-surface/20">
              Security & Active Sessions
            </h4>
            <div className="p-3 border border-on-surface bg-surface-container-low rounded-lg flex justify-between items-center text-xs font-mono">
              <div>
                <span className="font-bold block">Chrome / macOS Session</span>
                <span className="text-[10px] text-on-surface-variant/60">IP Address: 192.168.1.1</span>
              </div>
              <span className="text-secondary font-bold">Active Now</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
