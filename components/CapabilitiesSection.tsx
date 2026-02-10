"use client";

import {
  Rocket,
  Code2,
  Layers,
  Sparkles,
  Database,
  Search,
  ShoppingCart,
  Brain,
  Palette,
  Gauge,
  FileCode,
  Globe,
  Cpu,
  Zap,
  Box,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { dmMono } from "@/app/layout";

gsap.registerPlugin(ScrollTrigger);

type TabId = "core" | "tech" | "projects";

type TextBlock = { type: "text"; label: string; color: string };
type IconBlock = { type: "icon"; icon: LucideIcon; color: string; logoUrl?: string };
type BlockItem = TextBlock | IconBlock;

const TEXT_BLOCK_WIDTH = 260;
const TEXT_BLOCK_HEIGHT = 72;
const ICON_BLOCK_RADIUS = 36;

const TEXT_CORE: TextBlock[] = [
  { type: "text", label: "Web apps", color: "bg-amber-200/95 text-amber-900" },
  { type: "text", label: "No code", color: "bg-sky-200/95 text-sky-900" },
  { type: "text", label: "Full-stack", color: "bg-emerald-200/95 text-emerald-900" },
  { type: "text", label: "Motion & Interaction", color: "bg-rose-200/95 text-rose-900" },
  { type: "text", label: "Headless CMS", color: "bg-slate-200/95 text-slate-800" },
  { type: "text", label: "SEO", color: "bg-amber-200/95 text-amber-900" },
  { type: "text", label: "eCommerce", color: "bg-sky-200/95 text-sky-900" },
  { type: "text", label: "AI", color: "bg-emerald-200/95 text-emerald-900" },
  { type: "text", label: "Creative frontend", color: "bg-rose-200/95 text-rose-900" },
  { type: "text", label: "Performance", color: "bg-slate-200/95 text-slate-800" },
  { type: "text", label: "Less code", color: "bg-amber-200/95 text-amber-900" },
];

const TEXT_TECH: TextBlock[] = [
  { type: "text", label: "React", color: "bg-sky-200/95 text-sky-900" },
  { type: "text", label: "TypeScript", color: "bg-slate-200/95 text-slate-800" },
  { type: "text", label: "Node", color: "bg-emerald-200/95 text-emerald-900" },
  { type: "text", label: "APIs", color: "bg-rose-200/95 text-rose-900" },
  { type: "text", label: "Next.js", color: "bg-amber-200/95 text-amber-900" },
  { type: "text", label: "Tailwind", color: "bg-sky-200/95 text-sky-900" },
  { type: "text", label: "PostgreSQL", color: "bg-slate-200/95 text-slate-800" },
  { type: "text", label: "GraphQL", color: "bg-emerald-200/95 text-emerald-900" },
  { type: "text", label: "Vercel", color: "bg-rose-200/95 text-rose-900" },
  { type: "text", label: "GSAP", color: "bg-amber-200/95 text-amber-900" },
];

const TEXT_PROJECTS: TextBlock[] = [
  { type: "text", label: "Fintech", color: "bg-emerald-200/95 text-emerald-900" },
  { type: "text", label: "Remittance", color: "bg-sky-200/95 text-sky-900" },
  { type: "text", label: "Credit scoring", color: "bg-rose-200/95 text-rose-900" },
  { type: "text", label: "Dashboards", color: "bg-amber-200/95 text-amber-900" },
  { type: "text", label: "Mobile-first", color: "bg-slate-200/95 text-slate-800" },
  { type: "text", label: "Design systems", color: "bg-sky-200/95 text-sky-900" },
  { type: "text", label: "Real-time", color: "bg-emerald-200/95 text-emerald-900" },
  { type: "text", label: "Portfolio", color: "bg-rose-200/95 text-rose-900" },
];

const ICON_CORE: IconBlock[] = [
  { type: "icon", icon: Globe, color: "bg-amber-200/95 text-amber-900" },
  { type: "icon", icon: Zap, color: "bg-sky-200/95 text-sky-900" },
  { type: "icon", icon: Database, color: "bg-emerald-200/95 text-emerald-900" },
  { type: "icon", icon: Palette, color: "bg-rose-200/95 text-rose-900" },
  { type: "icon", icon: Gauge, color: "bg-slate-200/95 text-slate-800" },
  { type: "icon", icon: Rocket, color: "bg-amber-200/95 text-amber-900" },
  { type: "icon", icon: Code2, color: "bg-sky-200/95 text-sky-900" },
  { type: "icon", icon: Sparkles, color: "bg-emerald-200/95 text-emerald-900" },
  { type: "icon", icon: Brain, color: "bg-rose-200/95 text-rose-900" },
  { type: "icon", icon: Search, color: "bg-slate-200/95 text-slate-800" },
];

// Tech tab: real logos from Simple Icons CDN (https://cdn.simpleicons.org/)
const ICON_TECH: IconBlock[] = [
  { type: "icon", icon: Zap, color: "bg-sky-200/95 text-sky-900", logoUrl: "https://cdn.simpleicons.org/react/61DAFB" },
  { type: "icon", icon: Code2, color: "bg-slate-200/95 text-slate-800", logoUrl: "https://cdn.simpleicons.org/typescript/3178C6" },
  { type: "icon", icon: Cpu, color: "bg-emerald-200/95 text-emerald-900", logoUrl: "https://cdn.simpleicons.org/nodedotjs/339933" },
  { type: "icon", icon: Layers, color: "bg-rose-200/95 text-rose-900", logoUrl: "https://cdn.simpleicons.org/graphql/E10098" },
  { type: "icon", icon: Rocket, color: "bg-amber-200/95 text-amber-900", logoUrl: "https://cdn.simpleicons.org/nextdotjs/000000" },
  { type: "icon", icon: Palette, color: "bg-sky-200/95 text-sky-900", logoUrl: "https://cdn.simpleicons.org/tailwindcss/06B6D4" },
  { type: "icon", icon: Database, color: "bg-slate-200/95 text-slate-800", logoUrl: "https://cdn.simpleicons.org/postgresql/4169E1" },
  { type: "icon", icon: Search, color: "bg-emerald-200/95 text-emerald-900", logoUrl: "https://cdn.simpleicons.org/graphql/E10098" },
  { type: "icon", icon: Globe, color: "bg-rose-200/95 text-rose-900", logoUrl: "https://cdn.simpleicons.org/vercel/000000" },
  { type: "icon", icon: Sparkles, color: "bg-amber-200/95 text-amber-900", logoUrl: "https://cdn.simpleicons.org/gsap/88CE02" },
];

const ICON_PROJECTS: IconBlock[] = [
  { type: "icon", icon: Gauge, color: "bg-emerald-200/95 text-emerald-900" },
  { type: "icon", icon: Globe, color: "bg-sky-200/95 text-sky-900" },
  { type: "icon", icon: Brain, color: "bg-rose-200/95 text-rose-900" },
  { type: "icon", icon: Layers, color: "bg-amber-200/95 text-amber-900" },
  { type: "icon", icon: Box, color: "bg-slate-200/95 text-slate-800" },
  { type: "icon", icon: Palette, color: "bg-sky-200/95 text-sky-900" },
  { type: "icon", icon: Zap, color: "bg-emerald-200/95 text-emerald-900" },
  { type: "icon", icon: Rocket, color: "bg-rose-200/95 text-rose-900" },
];

const TAB_BLOCKS: Record<TabId, BlockItem[]> = {
  core: [...TEXT_CORE, ...ICON_CORE],
  tech: [...TEXT_TECH, ...ICON_TECH],
  projects: [...TEXT_PROJECTS, ...ICON_PROJECTS],
};

export default function CapabilitiesSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const blocksWrapRef = useRef<HTMLDivElement | null>(null);
  const hasLockedRef = useRef(false);
  const hasStartedRef = useRef(false);
  const engineRef = useRef<import("matter-js").Engine | null>(null);
  const runnerRef = useRef<import("matter-js").Runner | null>(null);
  const bodiesRef = useRef<import("matter-js").Body[]>([]);
  const divsRef = useRef<HTMLDivElement[]>([]);
  const dimensionsRef = useRef<{ w: number; h: number }[]>([]);
  const matterRef = useRef<typeof import("matter-js") | null>(null);
  const currentTabRef = useRef<TabId | null>(null);

  const [activeTab, setActiveTab] = useState<TabId>("core");
  const activeTabRef = useRef<TabId>(activeTab);
  activeTabRef.current = activeTab;

  // Scroll lock: when section enters view, align it; then pin for a brief moment so view holds before user can scroll to footer
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const scrollToAlign = () => {
      if (hasLockedRef.current) return;
      hasLockedRef.current = true;
      const top = section.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top, behavior: "smooth" });
    };

    const alignSt = ScrollTrigger.create({
      trigger: section,
      start: "top 88%",
      onEnter: scrollToAlign,
    });

    const pinSt = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "+=280",
      pin: true,
      pinSpacing: true,
    });

    return () => {
      alignSt.kill();
      pinSt.kill();
    };
  }, []);

  // Init physics once when section fully in view; then add blocks for active tab
  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    const blocksWrap = blocksWrapRef.current;
    if (!section || !container || !blocksWrap || hasStartedRef.current) return;

    const io = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry || hasStartedRef.current) return;
        const fullyInView = entry.isIntersecting && entry.intersectionRatio >= 0.5;
        if (fullyInView) {
          hasStartedRef.current = true;
          requestAnimationFrame(() => {
            requestAnimationFrame(() => initPhysicsAndBlocks(activeTabRef.current));
          });
        }
      },
      { threshold: [0.3, 0.5, 0.7, 1], rootMargin: "0px" }
    );
    io.observe(section);

    async function initPhysicsAndBlocks(tab: TabId) {
      if (!container || !blocksWrap) return;
      currentTabRef.current = tab;
      const Matter = await import("matter-js");
      matterRef.current = Matter;
      const { Engine, World, Bodies, Mouse, MouseConstraint, Runner, Events } = Matter;

      const rect = container.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      if (w < 50 || h < 50) return;

      const engine = Engine.create({ gravity: { x: 0, y: 0.8 } });
      engineRef.current = engine;
      const world = engine.world;
      world.bounds = { min: { x: 0, y: 0 }, max: { x: w, y: h } };

      // Bottom and side walls only (no top – throwing up can leave view)
      const ground = Bodies.rectangle(w / 2, h + 30, w + 100, 60, { isStatic: true, render: { visible: false } });
      const leftWall = Bodies.rectangle(-30, h / 2, 60, h + 100, { isStatic: true, render: { visible: false } });
      const rightWall = Bodies.rectangle(w + 30, h / 2, 60, h + 100, { isStatic: true, render: { visible: false } });
      World.add(world, [ground, leftWall, rightWall]);

      const mouse = Mouse.create(blocksWrap);
      const mouseConstraint = MouseConstraint.create(engine, {
        mouse,
        constraint: { stiffness: 0.15, damping: 0.1, render: { visible: false } },
      });
      World.add(world, mouseConstraint);

      Events.on(engine, "afterUpdate", () => {
        const bodies = bodiesRef.current;
        const divs = divsRef.current;
        const dims = dimensionsRef.current;
        bodies.forEach((body, i) => {
          const div = divs[i];
          const d = dims[i];
          if (!div || !d) return;
          const pos = body.position;
          const angle = body.angle;
          div.style.transform = `translate(${pos.x - d.w / 2}px, ${pos.y - d.h / 2}px) rotate(${angle}rad)`;
        });
      });

      const runner = Runner.create();
      Runner.run(runner, engine);
      runnerRef.current = runner;

      addBlocksForTab(Matter, world, blocksWrap, tab);
    }

    return () => {
      io.disconnect();
      import("matter-js").then((Matter) => {
        if (runnerRef.current) Matter.Runner.stop(runnerRef.current);
        if (engineRef.current) Matter.Engine.clear(engineRef.current);
        engineRef.current = null;
        runnerRef.current = null;
        matterRef.current = null;
      });
      bodiesRef.current = [];
      divsRef.current = [];
      dimensionsRef.current = [];
      if (blocksWrapRef.current) blocksWrapRef.current.innerHTML = "";
    };
  }, []);

  // When tab changes and physics already running: remove old blocks, add new ones from top
  useEffect(() => {
    if (currentTabRef.current === activeTab) return;
    if (!hasStartedRef.current || !engineRef.current || !matterRef.current || !blocksWrapRef.current) return;

    const Matter = matterRef.current;
    const world = engineRef.current.world;
    const blocksWrap = blocksWrapRef.current;

    Matter.World.remove(world, bodiesRef.current);
    bodiesRef.current = [];
    dimensionsRef.current = [];
    blocksWrap.innerHTML = "";
    divsRef.current = [];

    addBlocksForTab(Matter, world, blocksWrap, activeTab);
    currentTabRef.current = activeTab;
  }, [activeTab]);

  function addBlocksForTab(
    Matter: typeof import("matter-js"),
    world: import("matter-js").World,
    blocksWrap: HTMLDivElement,
    tab: TabId
  ) {
    const blocks = TAB_BLOCKS[tab];
    const cw = containerRef.current?.getBoundingClientRect().width ?? 800;
    const bodies: import("matter-js").Body[] = [];
    const divs: HTMLDivElement[] = [];
    const dimensions: { w: number; h: number }[] = [];

    blocks.forEach((block, i) => {
      const x = 100 + (i * 120) % Math.max(1, cw - 200);
      const y = -80 - i * 55;

      const isText = block.type === "text";
      let body: import("matter-js").Body;
      let w: number;
      let h: number;

      if (isText) {
        w = TEXT_BLOCK_WIDTH;
        h = TEXT_BLOCK_HEIGHT;
        body = Matter.Bodies.rectangle(x, y, w, h, {
          restitution: 0.3,
          friction: 0.4,
          frictionAir: 0.01,
          angle: (Math.random() - 0.5) * 0.8,
        });
      } else {
        w = ICON_BLOCK_RADIUS * 2;
        h = ICON_BLOCK_RADIUS * 2;
        body = Matter.Bodies.circle(x, y, ICON_BLOCK_RADIUS, {
          restitution: 0.3,
          friction: 0.4,
          frictionAir: 0.01,
          angle: (Math.random() - 0.5) * 0.8,
        });
      }

      bodies.push(body);
      dimensions.push({ w, h });
      Matter.World.add(world, body);

      const div = document.createElement("div");
      div.className = `absolute flex items-center justify-center font-medium select-none pointer-events-none text-center ${block.color}`;
      div.style.width = `${w}px`;
      div.style.height = `${h}px`;
      div.style.left = "0";
      div.style.top = "0";
      div.style.willChange = "transform";
      div.setAttribute("data-body-id", String(body.id));

      if (isText) {
        div.classList.add("rounded-[28px]", "text-2xl");
        const textSpan = document.createElement("span");
        textSpan.textContent = block.label;
        textSpan.className = "text-center leading-tight";
        div.appendChild(textSpan);
      } else {
        div.classList.add("rounded-full");
        if (block.logoUrl) {
          const img = document.createElement("img");
          img.src = block.logoUrl;
          img.alt = "";
          img.className = "w-8 h-8 object-contain";
          div.appendChild(img);
        } else {
          const iconWrap = document.createElement("span");
          iconWrap.className = "flex items-center justify-center [&_svg]:w-7 [&_svg]:h-7";
          iconWrap.innerHTML = getIconSvg(block.icon);
          div.appendChild(iconWrap);
        }
      }

      blocksWrap.appendChild(div);
      divs.push(div);
    });

    bodiesRef.current = bodies;
    divsRef.current = divs;
    dimensionsRef.current = dimensions;
  }

  return (
    <section
      id="capabilities"
      ref={sectionRef}
      className="relative z-20 min-h-screen w-full bg-section-bg flex flex-col overflow-hidden"
    >
      <div className="relative z-10 flex items-center justify-center gap-8 pt-16 pb-6">
        <button
          type="button"
          onClick={() => setActiveTab("core")}
          className={`cursor-pointer ${dmMono.className} text-sm tracking-widest text-foreground/90 hover:text-foreground transition ${
            activeTab === "core" ? "opacity-100" : "opacity-60"
          }`}
        >
          {activeTab === "core" ? "( CORE CAPABILITIES )" : "CORE CAPABILITIES"}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("tech")}
          className={`cursor-pointer ${dmMono.className} text-sm tracking-widest text-foreground/90 hover:text-foreground transition ${
            activeTab === "tech" ? "opacity-100" : "opacity-60"
          }`}
        >
          {activeTab === "tech" ? "( TECH STACKS )" : "TECH STACKS"}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("projects")}
          className={`cursor-pointer ${dmMono.className} text-sm tracking-widest text-foreground/90 hover:text-foreground transition ${
            activeTab === "projects" ? "opacity-100" : "opacity-60"
          }`}
        >
          {activeTab === "projects" ? "( PROJECTS )" : "PROJECTS"}
        </button>
      </div>

      <div
        ref={containerRef}
        className="relative z-10 flex-1 min-h-[60vh] mx-6 mb-8 rounded-2xl border border-border-subtle bg-card overflow-hidden cursor-grab active:cursor-grabbing"
      >
        <div
          ref={blocksWrapRef}
          className="absolute inset-0 pointer-events-auto"
          style={{ touchAction: "none" }}
        />
      </div>
    </section>
  );
}

// Simple 20x20 icon SVGs for Lucide-style icons (path only, no React component in DOM)
function getIconSvg(Icon: LucideIcon): string {
  const name = (Icon as { displayName?: string; name?: string }).displayName ?? (Icon as { name?: string }).name ?? "";
  const paths: Record<string, string> = {
    Rocket: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>',
    Code2: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>',
    Layers: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65"/><path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65"/></svg>',
    Sparkles: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>',
    Database: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>',
    Search: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
    ShoppingCart: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>',
    Brain: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>',
    Palette: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.648 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z"/></svg>',
    Gauge: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>',
    FileCode: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><path d="M14 2v6h6"/><path d="m10 13-2 2 2 2"/><path d="m14 17 2-2-2-2"/></svg>',
    Globe: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>',
    Cpu: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/></svg>',
    Zap: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>',
    Box: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>',
  };
  return paths[name] ?? paths.Box ?? "";
}
