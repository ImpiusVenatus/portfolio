"use client";

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { dmMono, spaceGrotesk } from "@/app/layout";

gsap.registerPlugin(ScrollTrigger);

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
        <div className={`text-[10px] tracking-[0.28em] text-white/45 ${dmMono.className}`}>SERVICES</div>
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
  // Autoplay: false = playing (default ON). Set to true for autoplay OFF by default.
  const [paused, setPaused] = useState(false);
  const AUTOPLAY_INTERVAL_MS = 5500;

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const pillRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const serviceLineRef = useRef<HTMLDivElement | null>(null);
  const progressWrapRef = useRef<HTMLDivElement | null>(null);
  const arrowsRef = useRef<HTMLDivElement | null>(null);
  const pauseRef = useRef<HTMLDivElement | null>(null);

  const progressCircleRef = useRef<SVGCircleElement | null>(null);
  const autoplayRef = useRef<number | null>(null);
  const hasEnteredRef = useRef(false);
  const hasAutoLockedRef = useRef(false);
  const prevActiveRef = useRef<number | null>(null); // null = first mount, then 0..n-1
  const entranceTlRef = useRef<gsap.core.Timeline | null>(null);
  const carouselTlRef = useRef<gsap.core.Timeline | null>(null);

  const clampIndex = (i: number) => {
    const n = services.length;
    return ((i % n) + n) % n;
  };

  const goNext = () => setActive((v) => clampIndex(v + 1));
  const goPrev = () => setActive((v) => clampIndex(v - 1));

  // Carousel: on slide change (arrow tap), animate left content + pill, line, then dots/rows one by one
  useLayoutEffect(() => {
    if (prevActiveRef.current === active) return;
    const isFirstRun = prevActiveRef.current === null;
    prevActiveRef.current = active;
    if (isFirstRun) return;

    const contentEl = contentRef.current;
    const pillEl = pillRef.current;
    const lineEl = serviceLineRef.current;
    const cardEl = cardRef.current;
    if (!contentEl || !pillEl || !lineEl || !cardEl) return;

    const rafId = requestAnimationFrame(() => {
      const rows = Array.from(cardEl.querySelectorAll<HTMLElement>("[data-service-row]"));
      gsap.killTweensOf([contentEl, pillEl, lineEl, ...rows]);

      const tl = gsap.timeline();
      tl.fromTo(
        [pillEl, contentEl],
        { autoAlpha: 0, y: 14, filter: "blur(12px)" },
        { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.42, ease: "power2.out", stagger: 0.06 },
        0
      );
      tl.fromTo(
        lineEl,
        { scaleY: 0, transformOrigin: "top center" },
        { scaleY: 1, duration: 0.55, ease: "power2.out" },
        0.1
      );
      rows.forEach((row, i) => {
        tl.fromTo(
          row,
          { autoAlpha: 0, y: 12 },
          { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" },
          0.58 + i * 0.22
        );
      });
      carouselTlRef.current = tl;
    });

    return () => {
      cancelAnimationFrame(rafId);
      carouselTlRef.current?.kill();
      carouselTlRef.current = null;
    };
  }, [active]);

  // ✅ Scroll-triggered entrance: section pins when fully in view, then left → right (line + dots/rows) → nav elements
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const contentEl = contentRef.current;
    const pillEl = pillRef.current;
    const cardEl = cardRef.current;
    const progressWrap = progressWrapRef.current;
    const arrowsEl = arrowsRef.current;
    const pauseEl = pauseRef.current;
    if (
      !wrapper ||
      !contentEl ||
      !pillEl ||
      !cardEl ||
      !progressWrap ||
      !arrowsEl ||
      !pauseEl
    )
      return;

    // No initial hide — section is visible on load; entrance only runs when scroll triggers it
    const entranceTl = gsap.timeline({ paused: true });

    // Entrance: left content + nav only. Right block (card, line, rows) is NEVER touched by GSAP here — always visible.
    entranceTl.to(contentEl, {
      autoAlpha: 1,
      y: 0,
      duration: 0.5,
      ease: "power2.out",
    }, 0);

    // Progress, pill, arrows, pause
    entranceTl.to(
      [progressWrap, pillEl, arrowsEl, pauseEl],
      { autoAlpha: 1, duration: 0.35, stagger: 0.06, ease: "power2.out" },
      0.5
    );
    entranceTlRef.current = entranceTl;

    // If section is already in view on load (e.g. refresh), run entrance so content shows
    const checkAlreadyInView = () => {
      if (hasEnteredRef.current) return;
      const top = wrapper.getBoundingClientRect().top;
      if (top < window.innerHeight * 0.6) {
        hasEnteredRef.current = true;
        hasAutoLockedRef.current = true;
        entranceTl.play();
      }
    };
    const inViewTimeout = window.setTimeout(checkAlreadyInView, 200);

    // Auto-scroll so section fully enters viewport (one-time; no manual scroll needed)
    const scrollToLockSection = () => {
      if (hasAutoLockedRef.current) return;
      hasAutoLockedRef.current = true;
      const targetY = window.scrollY + wrapper.getBoundingClientRect().top;
      window.scrollTo({ top: targetY, behavior: "smooth" });
      // If pin's onEnter doesn't fire (e.g. scroll ends slightly off), run entrance after scroll settles
      setTimeout(() => {
        if (hasEnteredRef.current) return;
        const wr = wrapperRef.current;
        if (wr && wr.getBoundingClientRect().top < 150) {
          hasEnteredRef.current = true;
          entranceTlRef.current?.play();
        }
      }, 900);
    };

    // Trigger 1: when Hero section leaves view (most reliable - user has scrolled past hero)
    const heroEl = document.getElementById("hero");
    const heroSt = heroEl
      ? ScrollTrigger.create({
          trigger: heroEl,
          start: "bottom top",
          onEnter: scrollToLockSection,
        })
      : null;

    // Trigger 2: when services section starts to enter viewport (earlier = "top 90%")
    const lockSt = ScrollTrigger.create({
      trigger: wrapper,
      start: "top 90%",
      onEnter: scrollToLockSection,
    });

    // Trigger 3: when Hero timeline completes
    window.addEventListener("hero:complete", scrollToLockSection);

    // When section reaches top: pin and play entrance
    const pinSt = ScrollTrigger.create({
      trigger: wrapper,
      start: "top top",
      end: "+=1000",
      pin: true,
      pinSpacing: true,
      onEnter: () => {
        if (hasEnteredRef.current) return;
        hasEnteredRef.current = true;
        entranceTl.play();
      },
    });

    return () => {
      window.clearTimeout(inViewTimeout);
      window.removeEventListener("hero:complete", scrollToLockSection);
      heroSt?.kill();
      lockSt.kill();
      pinSt.kill();
      entranceTl.kill();
      entranceTlRef.current = null;
    };
  }, []);

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

  // Autoplay: when not paused, advance to next slide every AUTOPLAY_INTERVAL_MS
  useEffect(() => {
    if (autoplayRef.current) {
      window.clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
    if (!paused) {
      autoplayRef.current = window.setInterval(() => {
        setActive((v) => clampIndex(v + 1));
      }, AUTOPLAY_INTERVAL_MS);
    }
    return () => {
      if (autoplayRef.current) {
        window.clearInterval(autoplayRef.current);
        autoplayRef.current = null;
      }
    };
  }, [paused]);

  const s = services[active];

  return (
    <div ref={wrapperRef} className="relative z-30 h-screen w-screen box-border bg-[#101318] py-10 px-8">
      <section
        id="services"
        className="relative h-full w-full bg-[#101318] rounded-[28px] overflow-hidden border border-white/10"
      >
      {/* Background vibe */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-white/5" />
        <div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -right-40 -bottom-40 h-[520px] w-[520px] rounded-full bg-white/10 blur-3xl" />
      </div>

      {/* Top-left progress ring */}
      <div ref={progressWrapRef} className="absolute left-14 top-14 z-20">
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
      <div className="relative z-10 px-14 py-16 h-full min-h-0 flex items-center">
        <div className="w-full relative">
          {/* Left content */}
          <div ref={contentRef} className="max-w-[720px]">
            <h2 className={`${spaceGrotesk.className} text-[#F4F1D8] font-bold text-[96px] leading-[0.95]`}>
              {s.title}
            </h2>

            <p className="mt-8 max-w-[560px] text-white/60 leading-relaxed">{s.short}</p>

            <a
              href={s.ctaHref}
              className={`group relative mt-10 inline-flex items-center justify-center gap-2 text-white/80 hover:text-white transition-colors duration-200 ${dmMono.className} tracking-widest text-xs`}
            >
              <span className="pointer-events-none absolute -left-4 top-1/2 -translate-y-1/2 opacity-0 -translate-x-1 transition-all duration-200 ease-out group-hover:opacity-100 group-hover:translate-x-0">
                <Image src="/icons/hero-bracket.svg" alt="" width={6} height={6} className="opacity-90" />
              </span>
              <span>{s.ctaLabel}</span>
              <span className="inline-block text-white/60 transition-transform duration-300 ease-out group-hover:rotate-[360deg] group-hover:scale-110">
                ↗
              </span>
              <span className="pointer-events-none absolute -right-4 top-1/2 -translate-y-1/2 opacity-0 translate-x-1 transition-all duration-200 ease-out group-hover:opacity-100 group-hover:translate-x-0">
                <Image
                  src="/icons/hero-bracket.svg"
                  alt=""
                  width={6}
                  height={6}
                  className="opacity-90 rotate-180"
                />
              </span>
            </a>
          </div>

          {/* Right: SERVICE block (timeline-style) — positioned below top-right line */}
          <div className="absolute right-14 top-0">
            <div
              ref={cardRef}
              className="relative w-[420px] min-h-[280px] pl-8"
            >
              {/* Vertical accent line */}
              <div ref={serviceLineRef} className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-[#F4F1D8]/40 via-white/20 to-transparent origin-top" />
              <div className={`text-[11px] tracking-[0.28em] text-white/50 ${dmMono.className}`}>SERVICE</div>

              <div className="mt-5 space-y-0">
                {s.cards.map((c) => (
                  <div
                    key={c.label}
                    data-service-row
                    className="relative flex gap-4 py-4 border-b border-white/[0.06] last:border-0 last:pb-0 first:pt-0"
                  >
                    <span className="absolute -left-8 top-1/2 -translate-y-1/2 w-0 flex justify-center" aria-hidden>
                    <span className="absolute left-0 top-0 h-1.5 w-1.5 rounded-full bg-[#F4F1D8]/70 -translate-x-1/2" />
                  </span>
                    <div>
                      <div className="text-white/90 font-semibold text-base tracking-tight">{c.label}</div>
                      <div className="mt-0.5 text-white/50 text-sm">{c.meta}</div>
                      <div className={`mt-1.5 text-white/45 text-[11px] tracking-widest ${dmMono.className}`}>
                        {c.stack}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom-left arrows (section anchored) */}
      <div ref={arrowsRef} className="absolute left-14 bottom-14 z-20 flex items-center gap-3">
        <button
          onClick={goPrev}
          className="h-10 w-10 rounded-full border border-white/10 bg-white/5 backdrop-blur text-white/70 hover:text-white transition flex items-center justify-center"
          aria-label="Previous"
        >
          ←
        </button>

        <button
          onClick={goNext}
          className="h-10 w-10 rounded-full border border-white/10 bg-white/5 backdrop-blur text-white/70 hover:text-white transition flex items-center justify-center"
          aria-label="Next"
        >
          →
        </button>
      </div>

      {/* Bottom-right pause/play button (section anchored) */}
      <div ref={pauseRef} className="absolute right-14 bottom-14 z-20 flex items-center gap-3">
        <button
          onClick={() => setPaused((v) => !v)}
          className="h-10 w-10 rounded-full border border-white/10 bg-white/5 backdrop-blur text-white/70 hover:text-white transition flex items-center justify-center"
          aria-label={paused ? "Play" : "Pause"}
        >
          {paused ? (
            <svg className="w-4 h-4 ml-0.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M8 5v14l11-7L8 5z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
            </svg>
          )}
        </button>
      </div>
    </section>
    </div>
  );
}
