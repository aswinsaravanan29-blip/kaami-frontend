"use client";

import React, { useState } from "react";

interface NeubrutalButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  shadowSize?: "sm" | "md";
}

export default function NeubrutalButton({
  children,
  className = "",
  shadowSize = "sm",
  ...props
}: NeubrutalButtonProps) {
  const [isActive, setIsActive] = useState(false);

  const shadowClass = shadowSize === "sm" ? "neubrutal-shadow-sm" : "neubrutal-shadow";

  return (
    <button
      onMouseDown={() => setIsActive(true)}
      onMouseUp={() => setIsActive(false)}
      onMouseLeave={() => setIsActive(false)}
      className={`transition-all duration-150 select-none ${
        isActive
          ? "translate-x-[2px] translate-y-[2px] [box-shadow:none_!important]"
          : `${shadowClass} hover:translate-x-[2px] hover:translate-y-[2px] hover:[box-shadow:none_!important]`
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
