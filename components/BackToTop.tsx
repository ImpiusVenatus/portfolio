"use client";

import { useNavbarContrast } from "./NavbarContrastProvider";
import { cn } from "@/lib/utils";

export default function BackToTop() {
  const contrast = useNavbarContrast();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className={cn(
        "fixed z-[10001] flex items-center justify-center w-12 h-12 rounded-full backdrop-blur-sm border cursor-pointer transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-foreground/40 overflow-visible",
        "bottom-[1.5rem] right-[1.5rem]",
        contrast === "dark"
          ? "bg-[#1a1a1a]/15 text-[#1a1a1a] hover:bg-[#1a1a1a]/25 border-[#1a1a1a]/20"
          : "bg-white/15 text-white hover:bg-white/25 border-white/20"
      )}
      aria-label="Back to top"
    >
      <span className="absolute inset-0 rounded-full bg-foreground/20 pointer-events-none animate-back-to-top-pulse" aria-hidden />
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 shrink-0">
        <path d="M18 15l-6-6-6 6" />
      </svg>
    </button>
  );
}
