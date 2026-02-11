"use client";

import React, { useEffect, useRef, useState } from "react";
import { ToggleTheme } from "@/components/lightswind/toggle-theme";

const LOCK_ZONE_LEFT = 120;
const LOCK_ZONE_BOTTOM = 120;
const BOUNCE_RESTITUTION = 0.82; // lose more energy on each bounce (less bouncy)
const AIR_RESISTANCE = 0.99; // slow down a bit between bounces
const VELOCITY_MULT = 0.38; // throw speed (reduced)
const DRAG_THRESHOLD = 8;

export default function DraggableThemeToggle() {
  const [locked, setLocked] = useState(true);
  const [pos, setPos] = useState({ x: 24, y: 400 });
  const velRef = useRef({ vx: 0, vy: 0 });
  const posRef = useRef(pos);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const rafRef = useRef<number>(0);
  const didDragRef = useRef(false);
  const pointerHistoryRef = useRef<{ x: number; y: number; t: number }[]>([]);
  const pointerDownRef = useRef<{ x: number; y: number; t: number } | null>(null);
  const VEL_WINDOW_MS = 70; // velocity = movement in the last ~70ms only (momentum at release)
  const MAX_HISTORY = 12;

  posRef.current = pos;

  useEffect(() => {
    if (typeof window === "undefined") return;
    setPos({ x: 24, y: window.innerHeight - 24 - 48 });
  }, []);

  useEffect(() => {
    if (locked) return;
    const w = wrapperRef.current?.offsetWidth ?? 48;
    const h = wrapperRef.current?.offsetHeight ?? 48;
    let lastT = performance.now();

    const step = (t: number) => {
      if (draggingRef.current) {
        rafRef.current = requestAnimationFrame(step);
        return;
      }
      const dt = Math.min((t - lastT) / 16, 3);
      lastT = t;
      const v = velRef.current;
      let { x, y } = posRef.current;
      x += v.vx * dt;
      y += v.vy * dt;
      const maxX = window.innerWidth - w;
      const maxY = window.innerHeight - h;

      if (x <= 0) {
        x = 0;
        v.vx = -v.vx * BOUNCE_RESTITUTION;
      }
      if (x >= maxX) {
        x = maxX;
        v.vx = -v.vx * BOUNCE_RESTITUTION;
      }
      if (y <= 0) {
        y = 0;
        v.vy = -v.vy * BOUNCE_RESTITUTION;
      }
      if (y >= maxY) {
        y = maxY;
        v.vy = -v.vy * BOUNCE_RESTITUTION;
      }

      posRef.current = { x, y };
      setPos({ x, y });
      velRef.current = { vx: v.vx * AIR_RESISTANCE, vy: v.vy * AIR_RESISTANCE };

      if (x < LOCK_ZONE_LEFT && y > window.innerHeight - LOCK_ZONE_BOTTOM - h) {
        setLocked(true);
        setPos({ x: 24, y: window.innerHeight - 24 - h });
        velRef.current = { vx: 0, vy: 0 };
        return;
      }
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [locked]);

  const handlePointerDown = (e: React.PointerEvent) => {
    didDragRef.current = false;
    draggingRef.current = true;
    velRef.current = { vx: 0, vy: 0 };
    const now = performance.now();
    pointerHistoryRef.current = [{ x: e.clientX, y: e.clientY, t: now }];
    pointerDownRef.current = { x: e.clientX, y: e.clientY, t: now };
    if (locked) {
      const rect = wrapperRef.current?.getBoundingClientRect();
      if (rect) {
        posRef.current = { x: rect.left, y: rect.top };
        setPos({ x: rect.left, y: rect.top });
      }
      setLocked(false);
    }
    wrapperRef.current?.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    const history = pointerHistoryRef.current;
    if (history.length > 0) {
      const last = history[history.length - 1];
      if (Math.abs(e.clientX - last.x) > DRAG_THRESHOLD || Math.abs(e.clientY - last.y) > DRAG_THRESHOLD) {
        didDragRef.current = true;
      }
    }
    const now = performance.now();
    history.push({ x: e.clientX, y: e.clientY, t: now });
    if (history.length > MAX_HISTORY) history.shift();
    if (!locked) {
      const w = wrapperRef.current?.offsetWidth ?? 48;
      const h = wrapperRef.current?.offsetHeight ?? 48;
      const x = Math.max(0, Math.min(window.innerWidth - w, e.clientX - w / 2));
      const y = Math.max(0, Math.min(window.innerHeight - h, e.clientY - h / 2));
      posRef.current = { x, y };
      setPos({ x, y });
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    wrapperRef.current?.releasePointerCapture(e.pointerId);
    const wasDrag = didDragRef.current;
    draggingRef.current = false;
    if (wasDrag) {
      e.preventDefault();
      e.stopPropagation();
      const now = performance.now();
      const releaseX = e.clientX;
      const releaseY = e.clientY;
      const history = pointerHistoryRef.current;
      let vx = 0;
      let vy = 0;
      const fromT = now - VEL_WINDOW_MS;
      const past = history.filter((p) => p.t <= fromT);
      const sample = past.length > 0 ? past[past.length - 1] : (history[0] ?? pointerDownRef.current);
      if (sample && now > sample.t) {
        const dt = Math.max(8, now - sample.t);
        vx = (releaseX - sample.x) / dt * 60 * VELOCITY_MULT;
        vy = (releaseY - sample.y) / dt * 60 * VELOCITY_MULT;
      }
      velRef.current = { vx, vy };
    } else {
      (wrapperRef.current?.querySelector("button") as HTMLButtonElement | null)?.click();
    }
    pointerHistoryRef.current = [];
    pointerDownRef.current = null;
  };

  const handleClickCapture = (e: React.MouseEvent) => {
    if (didDragRef.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <div
      ref={wrapperRef}
      className="fixed z-[10002] flex items-center justify-center"
      style={
        locked
          ? { bottom: "1.5rem", left: "1.5rem" }
          : { left: pos.x, top: pos.y, willChange: "left, top" }
      }
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onClickCapture={handleClickCapture}
      onPointerLeave={(e) => {
        if (e.buttons === 0) draggingRef.current = false;
      }}
    >
      <ToggleTheme
        className="rounded-full bg-foreground/15 text-foreground hover:bg-foreground/25 backdrop-blur-sm p-2.5 border border-border-subtle cursor-grab active:cursor-grabbing touch-none select-none"
        aria-label="Toggle light/dark mode"
      />
    </div>
  );
}
