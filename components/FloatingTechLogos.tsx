"use client";

import Image from "next/image";
import React, { useCallback, useEffect, useRef, useState } from "react";

const LOGO_SIZE = 48;
const DAMPING = 0.92;
const THROW_MULT = 0.35;

// Paths under public/tech/ - add PNGs (e.g. react.png, fastapi.png)
const TECH_LOGOS = [
  "/tech/react.png",
  "/tech/fastapi.png",
  "/tech/mongodb.png",
  "/tech/nodejs.png",
  "/tech/aws.png",
  "/tech/postgres.png",
  "/tech/tailwind.png",
  "/tech/typescript.png",
  "/tech/nextjs.png",
  "/tech/python.png",
];

type Vec = { x: number; y: number };

export default function FloatingTechLogos({ containerRef }: { containerRef: React.RefObject<HTMLElement | null> }) {
  const [mounted, setMounted] = useState(false);
  const positionsRef = useRef<Vec[]>([]);
  const velocitiesRef = useRef<Vec[]>([]);
  const elRefs = useRef<(HTMLDivElement | null)[]>([]);
  const draggingRef = useRef<number | null>(null);
  const pointerStartRef = useRef<Vec>({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  const initPositions = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const padding = LOGO_SIZE;
    const w = rect.width - padding * 2;
    const h = rect.height - padding * 2;
    if (w <= 0 || h <= 0) return;
    TECH_LOGOS.forEach((_, i) => {
      positionsRef.current[i] = {
        x: padding + ((i * 0.17) % 1) * w,
        y: padding + ((i * 0.23) % 1) * h,
      };
      velocitiesRef.current[i] = {
        x: (Math.random() - 0.5) * 1.2,
        y: (Math.random() - 0.5) * 1.2,
      };
    });
    setMounted(true);
  }, [containerRef]);

  useEffect(() => {
    initPositions();
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(initPositions);
    ro.observe(el);
    return () => ro.disconnect();
  }, [containerRef, initPositions]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !mounted) return;

    let lastT = performance.now();
    const step = (t: number) => {
      const dt = Math.min((t - lastT) / 16, 3);
      lastT = t;
      const rect = container.getBoundingClientRect();
      const maxX = rect.width - LOGO_SIZE;
      const maxY = rect.height - LOGO_SIZE;
      const dragging = draggingRef.current;

      for (let i = 0; i < TECH_LOGOS.length; i++) {
        if (i === dragging) continue;
        const p = positionsRef.current[i];
        const v = velocitiesRef.current[i];
        if (!p || !v) continue;
        p.x += v.x * dt * 60 * 0.016;
        p.y += v.y * dt * 60 * 0.016;
        if (p.x <= 0) {
          p.x = 0;
          v.x = -v.x * DAMPING;
        }
        if (p.x >= maxX) {
          p.x = maxX;
          v.x = -v.x * DAMPING;
        }
        if (p.y <= 0) {
          p.y = 0;
          v.y = -v.y * DAMPING;
        }
        if (p.y >= maxY) {
          p.y = maxY;
          v.y = -v.y * DAMPING;
        }
        const div = elRefs.current[i];
        if (div) {
          div.style.left = `${p.x}px`;
          div.style.top = `${p.y}px`;
        }
      }
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [containerRef, mounted]);

  const onPointerDown = (e: React.PointerEvent, i: number) => {
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    draggingRef.current = i;
    pointerStartRef.current = { x: e.clientX, y: e.clientY };
    velocitiesRef.current[i] = { x: 0, y: 0 };
  };

  const onPointerMove = (e: React.PointerEvent, i: number) => {
    if (draggingRef.current !== i) return;
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left - LOGO_SIZE / 2;
    const y = e.clientY - rect.top - LOGO_SIZE / 2;
    const maxX = rect.width - LOGO_SIZE;
    const maxY = rect.height - LOGO_SIZE;
    const p = {
      x: Math.max(0, Math.min(maxX, x)),
      y: Math.max(0, Math.min(maxY, y)),
    };
    positionsRef.current[i] = p;
    const div = elRefs.current[i];
    if (div) {
      div.style.left = `${p.x}px`;
      div.style.top = `${p.y}px`;
    }
  };

  const onPointerUp = (e: React.PointerEvent, i: number) => {
    if (draggingRef.current !== i) return;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    draggingRef.current = null;
    const dx = e.clientX - pointerStartRef.current.x;
    const dy = e.clientY - pointerStartRef.current.y;
    velocitiesRef.current[i] = {
      x: dx * THROW_MULT,
      y: dy * THROW_MULT,
    };
  };

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden>
      <div className="absolute inset-0 pointer-events-auto">
        {TECH_LOGOS.map((src, i) => (
          <div
            key={src}
            ref={(el) => { elRefs.current[i] = el; }}
            className="absolute cursor-grab active:cursor-grabbing select-none touch-none"
            style={{
              width: LOGO_SIZE,
              height: LOGO_SIZE,
              left: positionsRef.current[i]?.x ?? 0,
              top: positionsRef.current[i]?.y ?? 0,
              willChange: "left, top",
            }}
            onPointerDown={(e) => onPointerDown(e, i)}
            onPointerMove={(e) => onPointerMove(e, i)}
            onPointerUp={(e) => onPointerUp(e, i)}
            onPointerLeave={(e) => {
              if (draggingRef.current === i && e.buttons === 0) {
                draggingRef.current = null;
                (e.target as HTMLElement).releasePointerCapture(e.pointerId);
              }
            }}
          >
            <Image
              src={src}
              alt=""
              width={LOGO_SIZE}
              height={LOGO_SIZE}
              className="pointer-events-none w-full h-full object-contain"
              unoptimized
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
