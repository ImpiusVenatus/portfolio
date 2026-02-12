"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type ContrastMode = "dark" | "light";

const NavbarContrastContext = createContext<ContrastMode>("dark");

export function useNavbarContrast() {
  return useContext(NavbarContrastContext);
}

export function NavbarContrastProvider({ children }: { children: React.ReactNode }) {
  const [contrast, setContrast] = useState<ContrastMode>("dark");

  useEffect(() => {
    const updateFromTheme = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setContrast(isDark ? "light" : "dark");
    };

    const updateContrast = () => {
      if (!document.getElementById("hero")) {
        updateFromTheme();
        return;
      }
      const st = ScrollTrigger.getById("hero-pin");
      const isDark = document.documentElement.classList.contains("dark");
      if (st && st.progress < 0.99) {
        const p = st.progress;
        setContrast(p >= 0.5 ? "light" : isDark ? "light" : "dark");
      } else {
        updateFromTheme();
      }
    };

    const onHeroProgress = (e: CustomEvent<{ progress: number }>) => {
      const p = e.detail?.progress ?? 0;
      const isDark = document.documentElement.classList.contains("dark");
      setContrast(p >= 0.5 ? "light" : isDark ? "light" : "dark");
    };

    window.addEventListener("hero:progress" as any, onHeroProgress as any);

    const tick = () => {
      if (!document.getElementById("hero")) {
        updateFromTheme();
        return;
      }
      const st = ScrollTrigger.getById("hero-pin");
      if (!st) return;
      if (st.progress >= 0.99) {
        updateFromTheme();
      }
    };
    gsap.ticker.add(tick);

    const observer = new MutationObserver(updateFromTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    // Initial: may run before Hero mounts, so use theme for non-home pages
    requestAnimationFrame(() => {
      updateContrast();
    });

    return () => {
      window.removeEventListener("hero:progress" as any, onHeroProgress as any);
      gsap.ticker.remove(tick);
      observer.disconnect();
    };
  }, []);

  return (
    <NavbarContrastContext.Provider value={contrast}>
      {children}
    </NavbarContrastContext.Provider>
  );
}
