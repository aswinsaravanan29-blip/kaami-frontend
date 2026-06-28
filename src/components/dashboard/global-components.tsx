"use client";

import React, { useEffect, useState } from "react";
import NeubrutalButton from "../interactive-button";

// --- TOAST NOTIFICATIONS ---
export interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info" | "sync";
}

interface ToastContainerProps {
  toasts: Toast[];
  removeToast: (id: string) => void;
}

export function ToastContainer({ toasts, removeToast }: ToastContainerProps) {
  return (
    <div className="fixed bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-sm z-[100] flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast) => {
        let bg = "bg-white";
        let icon = "info";
        let iconColor = "text-primary";

        if (toast.type === "success") {
          bg = "bg-secondary-container text-on-secondary-container";
          icon = "check_circle";
          iconColor = "text-secondary";
        } else if (toast.type === "error") {
          bg = "bg-error-container text-on-error-container";
          icon = "warning";
          iconColor = "text-error";
        } else if (toast.type === "sync") {
          bg = "bg-tertiary-fixed text-on-tertiary-fixed";
          icon = "sync";
          iconColor = "text-tertiary";
        }

        return (
          <div
            key={toast.id}
            className={`${bg} border-[3px] border-on-surface p-4 neubrutal-shadow-sm rounded-lg flex items-center justify-between pointer-events-auto animate-slide-in`}
          >
            <div className="flex items-center gap-3">
              <span className={`material-symbols-outlined ${iconColor} font-bold ${toast.type === "sync" ? "animate-spin" : ""}`}>
                {icon}
              </span>
              <span className="font-body-md font-bold text-[14px] leading-tight">
                {toast.message}
              </span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-on-surface hover:text-primary transition-colors ml-4 focus:outline-none"
            >
              <span className="material-symbols-outlined text-[18px] font-bold">close</span>
            </button>
          </div>
        );
      })}
    </div>
  );
}

// --- NEUBRUTAL MODAL WRAPPER ---
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function NeubrutalModal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#1c1b1b]/60 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Container */}
      <div className="relative w-full max-w-lg bg-surface border-[3px] border-on-surface p-6 neubrutal-shadow rounded-xl z-10 animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b-[2px] border-on-surface mb-4">
          <h3 className="font-headline-md text-headline-md uppercase font-black tracking-tight text-on-surface">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center border-[2px] border-on-surface rounded-full hover:bg-error-container hover:text-on-error-container transition-all"
          >
            <span className="material-symbols-outlined font-bold text-[18px]">close</span>
          </button>
        </div>
        {/* Content */}
        <div className="max-h-[70vh] overflow-y-auto pr-1">{children}</div>
      </div>
    </div>
  );
}

// --- NEUBRUTAL SIDE DRAWER WRAPPER ---
interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function NeubrutalDrawer({ isOpen, onClose, title, children }: DrawerProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <div
      className={`fixed inset-0 z-50 flex justify-end pointer-events-none transition-all duration-300 ${
        isOpen ? "bg-[#1c1b1b]/40 backdrop-blur-xs pointer-events-auto" : "bg-[#1c1b1b]/0"
      }`}
    >
      {/* Backdrop Area */}
      <div className={`flex-1 ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`} onClick={onClose} />
      {/* Slide-out Panel */}
      <div
        className={`w-full max-w-md bg-surface border-l-[3px] border-on-surface p-6 neubrutal-shadow flex flex-col ${
          isOpen ? "pointer-events-auto" : "pointer-events-none"
        } transition-transform duration-300 transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b-[2px] border-on-surface mb-4">
          <h3 className="font-headline-md text-headline-md uppercase font-black tracking-tight text-on-surface">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center border-[2px] border-on-surface rounded-full hover:bg-error-container hover:text-on-error-container transition-all"
          >
            <span className="material-symbols-outlined font-bold text-[18px]">close</span>
          </button>
        </div>
        {/* Content */}
        <div className="flex-1 overflow-y-auto pr-1">{children}</div>
      </div>
    </div>
  );
}

// --- COMMAND PALETTE (CTRL+K) ---
interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string) => void;
  onAction: (actionKey: string) => void;
}

export function CommandPalette({ isOpen, onClose, onNavigate, onAction }: CommandPaletteProps) {
  const [search, setSearch] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const items = [
    { type: "nav", id: "dashboard", name: "Go to Dashboard", shortcut: "G D", icon: "dashboard" },
    { type: "nav", id: "profile-builder", name: "Go to Profile Builder", shortcut: "G P", icon: "badge" },
    { type: "nav", id: "projects", name: "Go to Projects", shortcut: "G R", icon: "folder" },
    { type: "nav", id: "proofs", name: "Go to Proofs (Experience, Education...)", shortcut: "G F", icon: "verified" },
    { type: "nav", id: "certificates", name: "Go to Certificates", shortcut: "G C", icon: "workspace_premium" },
    { type: "nav", id: "skills", name: "Go to Skills", shortcut: "G S", icon: "code" },
    { type: "nav", id: "testimonials", name: "Go to Testimonials", shortcut: "G T", icon: "reviews" },
    { type: "nav", id: "verification", name: "Go to Verification Center", shortcut: "G V", icon: "policy" },
    { type: "nav", id: "analytics", name: "Go to Analytics", shortcut: "G A", icon: "analytics" },
    { type: "nav", id: "public-profile", name: "Go to Public Profile Preview", shortcut: "G U", icon: "preview" },
    { type: "nav", id: "share-center", name: "Go to Share Center", shortcut: "G H", icon: "share" },
    { type: "nav", id: "billing", name: "Go to Billing", shortcut: "G B", icon: "credit_card" },
    { type: "nav", id: "settings", name: "Go to Settings", shortcut: "G S", icon: "settings" },
    { type: "action", id: "add-project", name: "Quick Action: Add New Project", shortcut: "A P", icon: "add_circle" },
    { type: "action", id: "sync-github", name: "Quick Action: Sync GitHub Account", shortcut: "S G", icon: "sync" },
    { type: "action", id: "request-testimonial", name: "Quick Action: Request Testimonial", shortcut: "R T", icon: "rate_review" },
    { type: "action", id: "export-data", name: "Quick Action: Export Proof Data", shortcut: "E D", icon: "download" },
  ];

  const filtered = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#1c1b1b]/75 backdrop-blur-xs"
        onClick={onClose}
      />
      {/* Command Window */}
      <div className="relative w-full max-w-lg bg-surface border-[3px] border-on-surface neubrutal-shadow rounded-xl z-10 overflow-hidden">
        {/* Search Bar */}
        <div className="flex items-center gap-3 p-4 border-b-[3px] border-on-surface bg-surface-container-low">
          <span className="material-symbols-outlined text-on-surface font-bold">search</span>
          <input
            autoFocus
            type="text"
            placeholder="Type a command or search sections (Ctrl+K)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent font-body-md text-on-surface placeholder:text-on-surface/40 focus:outline-none"
          />
          <span className="font-mono text-[10px] bg-white border-[2px] border-on-surface px-1.5 py-0.5 rounded-sm select-none">
            ESC
          </span>
        </div>
        {/* Command List */}
        <div className="max-h-[350px] overflow-y-auto p-2 bg-surface">
          {filtered.length === 0 ? (
            <div className="p-4 text-center text-on-surface-variant font-body-md">
              No matching commands found.
            </div>
          ) : (
            filtered.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.type === "nav") {
                    onNavigate(item.id);
                  } else {
                    onAction(item.id);
                  }
                  onClose();
                }}
                className="w-full text-left p-3 hover:bg-primary-container hover:text-on-primary-container border-[2px] border-transparent hover:border-on-surface rounded-md flex items-center justify-between transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[20px] group-hover:text-on-primary-container text-on-surface-variant">
                    {item.icon}
                  </span>
                  <span className="font-body-md font-bold text-[14px]">
                    {item.name}
                  </span>
                </div>
                <span className="font-mono text-[10px] bg-white text-on-surface border-[2px] border-on-surface px-2 py-0.5 rounded-sm opacity-60 group-hover:opacity-100 transition-opacity">
                  {item.shortcut}
                </span>
              </button>
            ))
          )}
        </div>
        {/* Footer */}
        <div className="p-3 border-t-2 border-on-surface bg-surface-container-low flex items-center justify-between font-label-caps text-[10px] text-on-surface-variant">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px] font-bold">keyboard_arrow_up</span>
              <span className="material-symbols-outlined text-[12px] font-bold">keyboard_arrow_down</span>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[12px] font-bold">keyboard_return</span>
              Select
            </span>
          </div>
          <span>OSM API Future Enhancement Layer Enabled</span>
        </div>
      </div>
    </div>
  );
}
