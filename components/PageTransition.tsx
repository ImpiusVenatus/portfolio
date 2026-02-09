"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const HERO_BG = "#101318";
const COVER_SIZE = "180vmax"; // large enough to cover viewport when expanding from corner
const BORDER_RADIUS = 80;

export default function PageTransition({ onComplete }: { onComplete: () => void }) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const whiteRef = useRef<HTMLDivElement | null>(null);
  const heroRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const whiteEl = whiteRef.current;
    const heroEl = heroRef.current;
    if (!whiteEl || !heroEl) return;

    const WHITE_APPEAR_DUR = 0.25;
    const WHITE_GROW_DUR = 1.25;
    const HERO_FOLLOW_DELAY = 0.08;

    gsap.set(whiteEl, { width: 0, height: 0, opacity: 0 });
    gsap.set(heroEl, { width: 0, height: 0, opacity: 0 });

    const tl = gsap.timeline({
      onComplete: () => {
        onComplete();
      },
    });

    tl.to(whiteEl, {
      opacity: 1,
      duration: WHITE_APPEAR_DUR,
      ease: "power2.out",
    });
    tl.to(
      whiteEl,
      {
        width: COVER_SIZE,
        height: COVER_SIZE,
        duration: WHITE_GROW_DUR,
        ease: "power2.inOut",
      },
      WHITE_APPEAR_DUR * 0.4
    );

    tl.to(
      heroEl,
      { opacity: 1, duration: 0.1, ease: "power2.out" },
      WHITE_APPEAR_DUR + HERO_FOLLOW_DELAY
    );
    tl.to(
      heroEl,
      {
        width: COVER_SIZE,
        height: COVER_SIZE,
        duration: WHITE_GROW_DUR,
        ease: "power2.inOut",
      },
      WHITE_APPEAR_DUR + HERO_FOLLOW_DELAY
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
        className="absolute right-0 bottom-0 bg-white opacity-0"
        style={{
          width: 0,
          height: 0,
          borderRadius: BORDER_RADIUS,
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
