"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { dmMono, spaceGrotesk } from "@/app/layout";

type Service = {
  id: string;
  title: string;
  short: string;
  ctaLabel: string;
  ctaHref: string;

  pillTop: string;
  pillMid: string;
  pillBot: string;

  cards: Array<{
    label: string;
    meta: string;
    stack: string;
  }>;
};

function ProgressRing({
  value, // 1-based
  total,
  size = 96,
  stroke = 2,
  progressCircleRef,
}: {
  value: number;
  total: number;
  size?: number;
  stroke?: number;
  progressCircleRef: React.RefObject<SVGCircleElement | null>;
}) {
  const r = (size - stroke * 2) / 2;
  const c = 2 * Math.PI * r;

  // we animate strokeDashoffset via GSAP, so initial style can be anything valid
  return (
    <div className="relative" style={{ width: size, height: size }} aria-label={`Service ${value} of ${total}`}>
      <svg width={size} height={size} className="block">
        {/* track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="transparent"
          stroke="rgba(255,255,255,0.12)"
          strokeWidth={stroke}
        />
        {/* progress (animated) */}
        <circle
          ref={progressCircleRef}
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="transparent"
          stroke="rgba(244,241,216,0.92)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className={`text-[10px] tracking-[0.28em] text-white/45 ${dmMono.className}`}>PROJECT</div>
        <div className={`mt-1 text-white/80 ${dmMono.className} tracking-widest`}>
          {String(value).padStart(2, "0")} <span className="text-white/30">|</span> {String(total).padStart(2, "0")}
        </div>
      </div>
    </div>
  );
}

export default function ServicesSection() {
  const services = useMemo<Service[]>(
    () => [
      {
        id: "frontend",
        title: "Frontend & Design",
        short:
          "Premium UI implementation with smooth motion, clean typography, and fast performance. Built to feel expensive — and stay maintainable.",
        ctaLabel: "DISCUSS A FRONTEND",
        ctaHref: "#contact",
        pillTop: "SERVICES",
        pillMid: "NEXT.JS • REACT • TAILWIND",
        pillBot: "GSAP • FRAMER • UI SYSTEMS",
        cards: [
          { label: "Landing Pages", meta: "Scroll storytelling, premium feel", stack: "Next.js • Tailwind • GSAP" },
          { label: "Web Apps UI", meta: "Component architecture, speed", stack: "React • Next.js • Zustand/RP" },
          { label: "UI Systems", meta: "Design-system driven UI", stack: "Figma • Tokens • Shadcn" },
        ],
      },
      {
        id: "backend",
        title: "Backend & APIs",
        short:
          "Structured, secure APIs with clean schemas, auth, RBAC, and scalable database design. Built to ship — not to rewrite.",
        ctaLabel: "BUILD AN API",
        ctaHref: "#contact",
        pillTop: "BACKEND",
        pillMid: "FASTAPI • POSTGRES • AUTH",
        pillBot: "RBAC • CLEAN CRUD • DEPLOY",
        cards: [
          { label: "Authentication", meta: "JWT, sessions, refresh tokens", stack: "FastAPI • OAuth2 • JWT" },
          { label: "Database Design", meta: "Schemas, constraints, migrations", stack: "Postgres • SQLAlchemy • Alembic" },
          { label: "Integrations", meta: "Payments, email, third-party APIs", stack: "REST • Webhooks • Queues" },
        ],
      },
      {
        id: "software",
        title: "Software Engineering",
        short:
          "End-to-end engineering support: architecture, performance fixes, refactors, and building complex systems in a clean, modular way.",
        ctaLabel: "ENGINEERING HELP",
        ctaHref: "#contact",
        pillTop: "SOFTWARE",
        pillMid: "ARCHITECTURE • REFACTOR",
        pillBot: "QUALITY • PERFORMANCE • DX",
        cards: [
          { label: "System Architecture", meta: "Clean modules, scalable structure", stack: "SOLID • Modular • Clean APIs" },
          { label: "Performance", meta: "Fix bottlenecks, optimize UX", stack: "Profiling • Caching • Lazy" },
          { label: "Code Quality", meta: "Refactors without breaking things", stack: "Tests • Linting • Patterns" },
        ],
      },
      {
        id: "product",
        title: "Product & Strategy",
        short:
          "From idea to spec: clear product thinking, PRDs, MVP planning, and user flows — so the build is focused and not chaotic.",
        ctaLabel: "PLAN AN MVP",
        ctaHref: "#contact",
        pillTop: "PRODUCT",
        pillMid: "PRD • MVP • USER FLOWS",
        pillBot: "ROADMAP • WIREFRAMES",
        cards: [
          { label: "PRD & Scope", meta: "Clear requirements, less confusion", stack: "PRD • SRS • User Stories" },
          { label: "MVP Planning", meta: "Ship fast without cutting wrong corners", stack: "MVP • Roadmap • Iteration" },
          { label: "UX Flows", meta: "User journey + screens mapping", stack: "Flows • IA • Wireframes" },
        ],
      },
      {
        id: "marketing",
        title: "Marketing & Growth",
        short:
          "Landing page messaging, positioning, and conversion-focused design. The goal: make your product understandable and desirable fast.",
        ctaLabel: "IMPROVE CONVERSION",
        ctaHref: "#contact",
        pillTop: "GROWTH",
        pillMid: "POSITIONING • COPY • SEO",
        pillBot: "LANDING PAGES • ANALYTICS",
        cards: [
          { label: "Landing Copy", meta: "Clear value proposition, CTA", stack: "Copy • Structure • Tone" },
          { label: "SEO Basics", meta: "On-page optimization + performance", stack: "SEO • Core Web Vitals" },
          { label: "Analytics Setup", meta: "Track what matters, iterate faster", stack: "Events • Funnels • A/B" },
        ],
      },
    ],
    []
  );

  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const contentRef = useRef<HTMLDivElement | null>(null);
  const pillRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const progressCircleRef = useRef<SVGCircleElement | null>(null);
  const autoplayRef = useRef<number | null>(null);

  const clampIndex = (i: number) => {
    const n = services.length;
    return ((i % n) + n) % n;
  };

  const goNext = () => setActive((v) => clampIndex(v + 1));
  const goPrev = () => setActive((v) => clampIndex(v - 1));

  // ✅ animate content swap
  useEffect(() => {
    const contentEl = contentRef.current;
    const pillEl = pillRef.current;
    const cardEl = cardRef.current;
    if (!contentEl || !pillEl || !cardEl) return;

    gsap.killTweensOf([contentEl, pillEl, cardEl]);

    const tl = gsap.timeline();
    tl.fromTo(
      [pillEl, contentEl],
      { autoAlpha: 0, y: 14, filter: "blur(12px)" },
      { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.42, ease: "power2.out", stagger: 0.06 },
      0
    );
    tl.fromTo(
      cardEl,
      { autoAlpha: 0, y: 10, filter: "blur(10px)" },
      { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.42, ease: "power2.out" },
      0.08
    );

    return () => {
      tl.kill();
    };
  }, [active]);

  // ✅ animate progress ring on active change
  useEffect(() => {
    const circle = progressCircleRef.current;
    if (!circle) return;

    const size = 96;
    const stroke = 2;
    const r = (size - stroke * 2) / 2;
    const c = 2 * Math.PI * r;

    // progress 0..1 across pages
    const p = services.length <= 1 ? 1 : active / (services.length - 1);
    const targetDashOffset = c * (1 - p);

    gsap.killTweensOf(circle);
    const tl = gsap.timeline();
    tl.to(circle, { strokeDasharray: c, duration: 0.01 }, 0);
    tl.to(circle, { strokeDashoffset: targetDashOffset, duration: 0.55, ease: "power2.out" }, 0);

    return () => {
      tl.kill();
    };
  }, [active, services.length]);

  // ✅ autoplay the whole section
  useEffect(() => {
    // clear existing
    if (autoplayRef.current) {
      window.clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }

    if (paused) return;

    autoplayRef.current = window.setInterval(() => {
      setActive((v) => clampIndex(v + 1));
    }, 4500);

    return () => {
      if (autoplayRef.current) {
        window.clearInterval(autoplayRef.current);
        autoplayRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused]);

  const s = services[active];

  return (
    <section
      id="services"
      className="relative min-h-[100vh] bg-[#101318] rounded-[28px] overflow-hidden border border-white/10"
    >
      {/* Background vibe */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-white/5" />
        <div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -right-40 -bottom-40 h-[520px] w-[520px] rounded-full bg-white/10 blur-3xl" />
      </div>

      {/* Top-left progress ring */}
      <div className="absolute left-14 top-14 z-20">
        <ProgressRing
          value={active + 1}
          total={services.length}
          progressCircleRef={progressCircleRef}
        />
      </div>

      {/* Top-right labels (more space from top) */}
      <div ref={pillRef} className="absolute right-14 top-24 z-20 text-right">
        <div className={`text-[11px] tracking-[0.28em] text-white/70 ${dmMono.className}`}>{s.pillTop}</div>
        <div className={`mt-3 text-[11px] tracking-[0.22em] text-white/80 ${dmMono.className}`}>{s.pillMid}</div>
        <div className={`mt-2 text-[11px] tracking-[0.22em] text-white/80 ${dmMono.className}`}>{s.pillBot}</div>
        <div className="mt-6 h-px w-[520px] bg-white/10" />
      </div>

      {/* Center content */}
      <div className="relative z-10 px-14 py-16 min-h-[100vh] flex items-center">
        <div className="w-full relative">
          {/* Left content */}
          <div ref={contentRef} className="max-w-[720px]">
            <h2 className={`${spaceGrotesk.className} text-[#F4F1D8] font-bold text-[96px] leading-[0.95]`}>
              {s.title}
            </h2>

            <p className="mt-8 max-w-[560px] text-white/60 leading-relaxed">{s.short}</p>

            <a
              href={s.ctaHref}
              className={`mt-10 inline-flex items-center gap-3 text-white/80 hover:text-white transition ${dmMono.className} tracking-widest text-xs`}
            >
              <span className="inline-flex items-center justify-center h-9 px-5 rounded-full border border-white/15 bg-white/5 backdrop-blur">
                {s.ctaLabel}
              </span>
              <span className="text-white/60">↗</span>
            </a>
          </div>

          {/* Bottom-right SINGLE card (no stack) */}
          <div className="absolute right-14 bottom-20">
            <div
              ref={cardRef}
              className="relative w-[460px] h-[300px] rounded-[28px] border border-white/10 shadow-2xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-[#0B0E12]" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />

              <div className="relative p-7 h-full flex flex-col">
                <div className={`text-[11px] tracking-[0.28em] text-white/60 ${dmMono.className}`}>SERVICE</div>

                <div className="mt-4 space-y-4">
                  {s.cards.map((c) => (
                    <div key={c.label} className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4">
                      <div className="text-white/90 font-semibold text-lg">{c.label}</div>
                      <div className="mt-1 text-white/55 text-sm">{c.meta}</div>
                      <div className={`mt-2 text-white/60 text-[11px] tracking-widest ${dmMono.className}`}>
                        {c.stack}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-auto pt-5 flex items-center justify-between">
                  <div className={`text-[11px] tracking-[0.22em] text-white/55 ${dmMono.className}`}>NAV</div>
                  <div className="text-white/40 text-sm">← prev / next →</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom-left arrows (section anchored) */}
      <div className="absolute left-14 bottom-14 z-20 flex items-center gap-3">
        <button
          onClick={goPrev}
          className="h-10 w-10 rounded-full border border-white/10 bg-white/5 backdrop-blur text-white/70 hover:text-white transition"
          aria-label="Previous"
        >
          ←
        </button>

        <button
          onClick={goNext}
          className="h-10 w-10 rounded-full border border-white/10 bg-white/5 backdrop-blur text-white/70 hover:text-white transition"
          aria-label="Next"
        >
          →
        </button>

        <div className={`ml-3 text-[10px] tracking-[0.28em] text-white/40 ${dmMono.className}`}>
          {String(active + 1).padStart(2, "0")} / {String(services.length).padStart(2, "0")}
        </div>
      </div>

      {/* Bottom-right pause button (section anchored) */}
      <div className="absolute right-14 bottom-14 z-20 flex items-center gap-3">
        <button
          onClick={() => setPaused((v) => !v)}
          className="h-10 px-4 rounded-full border border-white/10 bg-white/5 backdrop-blur text-white/70 hover:text-white transition"
          aria-label={paused ? "Play" : "Pause"}
        >
          <span className={`${dmMono.className} text-[11px] tracking-[0.22em]`}>
            {paused ? "PLAY" : "PAUSE"}
          </span>
        </button>
      </div>
    </section>
  );
}
