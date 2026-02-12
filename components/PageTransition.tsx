"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const HERO_BG = "#101318";
const LIGHT_BG = "#F4F1D8"; // Off-white theme
const COVER_SIZE = "180vmax"; // large enough to cover viewport when expanding from corner
// Sharp bottom-right (anchor corner); other corners rounded so no gap at viewport corner
const BORDER_RADIUS = "80px 80px 0 80px"; // top-left, top-right, bottom-right, bottom-left

export default function PageTransition({ onComplete }: { onComplete: () => void }) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const whiteRef = useRef<HTMLDivElement | null>(null);
  const heroRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const whiteEl = whiteRef.current;
    const heroEl = heroRef.current;
    if (!whiteEl || !heroEl) return;

    const isDark = document.documentElement.classList.contains("dark");
    // Dark: first white, then hero. Light: first hero, then white.
    const firstEl = isDark ? whiteEl : heroEl;
    const secondEl = isDark ? heroEl : whiteEl;

    // Second rectangle must be on top so it's visible when it expands
    firstEl.style.zIndex = "10";
    secondEl.style.zIndex = "20";

    const APPEAR_DUR = 0.25;
    const GROW_DUR = 1.25;
    const FOLLOW_DELAY = 0.08;

    gsap.set(whiteEl, { width: 0, height: 0, opacity: 0 });
    gsap.set(heroEl, { width: 0, height: 0, opacity: 0 });

    const tl = gsap.timeline({
      onComplete: () => {
        onComplete();
      },
    });

    tl.to(firstEl, {
      opacity: 1,
      duration: APPEAR_DUR,
      ease: "power2.out",
    });
    tl.to(
      firstEl,
      {
        width: COVER_SIZE,
        height: COVER_SIZE,
        duration: GROW_DUR,
        ease: "power2.inOut",
      },
      APPEAR_DUR * 0.4
    );

    tl.to(
      secondEl,
      { opacity: 1, duration: 0.1, ease: "power2.out" },
      APPEAR_DUR + FOLLOW_DELAY
    );
    tl.to(
      secondEl,
      {
        width: COVER_SIZE,
        height: COVER_SIZE,
        duration: GROW_DUR,
        ease: "power2.inOut",
      },
      APPEAR_DUR + FOLLOW_DELAY
    );

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div
      ref={wrapRef}
      className="fixed inset-0 z-[9999] pointer-events-auto overflow-hidden"
      aria-hidden
    >
      <div
        ref={whiteRef}
        className="absolute right-0 bottom-0 opacity-0"
        style={{
          width: 0,
          height: 0,
          borderRadius: BORDER_RADIUS,
          backgroundColor: LIGHT_BG,
        }}
      />
      <div
        ref={heroRef}
        className="absolute right-0 bottom-0 opacity-0"
        style={{
          width: 0,
          height: 0,
          borderRadius: BORDER_RADIUS,
          backgroundColor: HERO_BG,
        }}
      />
    </div>
  );
}
