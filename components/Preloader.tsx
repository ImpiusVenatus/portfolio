"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const HERO_BG = "#101318";

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const progressFillRef = useRef<HTMLDivElement | null>(null);
  const progressTextRef = useRef<HTMLSpanElement | null>(null);
  const progressTrackRef = useRef<HTMLDivElement | null>(null);
  const circleRef = useRef<HTMLDivElement | null>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    let cancelled = false;
    let tl: gsap.core.Timeline | null = null;
    const maxRetries = 10;
    let retries = 0;
    const run = () => {
      const progressFill = progressFillRef.current;
      const progressText = progressTextRef.current;
      const progressTrack = progressTrackRef.current;
      const circle = circleRef.current;
      if (!progressFill || !circle) {
        if (typeof window !== "undefined" && retries < maxRetries) {
          retries += 1;
          requestAnimationFrame(() => {
            if (!cancelled) run();
          });
        }
        return;
      }

      const PROGRESS_DUR = 1.8;
      const CIRCLE_APPEAR_DUR = 0.3;
      const CIRCLE_GROW_DUR = 1;
      const circleStartScale = 0.01;
      const circleEndScale = 3;

      gsap.set(progressFill, { scaleX: 0, transformOrigin: "left center" });
      gsap.set(circle, {
        scale: circleStartScale,
        opacity: 0,
        transformOrigin: "50% 50%",
      });

      tl = gsap.timeline({
        onComplete: () => {
          onCompleteRef.current();
        },
      });

      tl.to(progressFill, {
        scaleX: 1,
        duration: PROGRESS_DUR,
        ease: "power2.inOut",
        onUpdate: function () {
          const p = Math.round((this.progress() ?? 0) * 100);
          if (progressText) progressText.textContent = `${p}%`;
        },
      });

      tl.to(
        circle,
        {
          opacity: 1,
          duration: CIRCLE_APPEAR_DUR,
          ease: "power2.out",
        },
        PROGRESS_DUR
      );

      tl.to(
        progressText,
        { color: "#fff", duration: 0.2, ease: "power2.out" },
        PROGRESS_DUR
      );
      tl.to(
        [progressTrack, progressFill].filter(Boolean),
        { backgroundColor: "#fff", duration: 0.2, ease: "power2.out" },
        PROGRESS_DUR
      );

      tl.to(
        circle,
        {
          scale: circleEndScale,
          duration: CIRCLE_GROW_DUR,
          ease: "power2.inOut",
        },
        PROGRESS_DUR + CIRCLE_APPEAR_DUR * 0.5
      );
    };
    run();
    return () => {
      cancelled = true;
      if (tl) tl.kill();
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center gap-4 bg-white"
      aria-hidden
    >
      {/* Percentage text above progress bar */}
      <span
        ref={progressTextRef}
        className="relative z-10 text-sm font-medium tabular-nums text-neutral-700"
      >
        0%
      </span>

      {/* Progress bar container */}
      <div
        ref={progressTrackRef}
        className="relative z-10 w-[min(280px,80vw)] h-1 bg-neutral-200 rounded-full overflow-hidden"
      >
        <div
          ref={progressFillRef}
          className="h-full w-full rounded-full"
          style={{ backgroundColor: HERO_BG }}
        />
      </div>

      {/* Circle that grows to fill screen (hero bg color) - hidden until GSAP */}
      <div
        ref={circleRef}
        className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0"
        style={{ transform: "scale(0.01)" }}
      >
        <div
          className="w-[100vmax] h-[100vmax] rounded-full"
          style={{ backgroundColor: HERO_BG }}
        />
      </div>
    </div>
  );
}
