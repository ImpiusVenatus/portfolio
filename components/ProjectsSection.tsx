"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown, ChevronUp } from "lucide-react";
import { dmMono, spaceGrotesk } from "@/app/layout";

gsap.registerPlugin(ScrollTrigger);

type Project = {
  id: string;
  name: string;
  role: string;
  period: string;
  headline: string;
  description: string;
  tech: string;
  mockupSrc: string;
};

const PROJECTS: Project[] = [
  {
    id: "buckyy",
    name: "Buckyy Underwriting",
    role: "VP of Technology / Technical Lead",
    period: "2024 – Present",
    headline: "AI-driven risk, credit, and underwriting infrastructure.",
    description:
      "Led architecture and delivery of Buckyy’s underwriting platform: from FastAPI services and decisioning engine to mobile SDKs and dashboards. Orchestrated risk pipelines, credit scoring (Rini), and partner integrations.",
    tech: "FastAPI · PostgreSQL · Redis · Docker · GCP · TypeScript · React · React Native · XGBoost",
    mockupSrc: "/mockup/mockup_buckyy.png",
  },
  {
    id: "probashipay",
    name: "ProbashiPay",
    role: "Full-stack Engineer",
    period: "2023 – Present",
    headline: "Payment rails for remittances and diaspora services.",
    description:
      "Implemented account flows and payment orchestration for international remittances. Focused on UX around onboarding, KYC, and cross-border settlement.",
    tech: "Next.js · Tailwind · FastAPI · PostgreSQL · Stripe · Cloud Run",
    mockupSrc: "/mockup/mockup_probashipay.png",
  },
  {
    id: "probashicare",
    name: "ProbashiCare",
    role: "Full-stack Engineer",
    period: "2023 – Present",
    headline: "Digital services for the Bangladeshi diaspora.",
    description:
      "Built a multi-tenant platform for health, legal, and consular services for Bangladeshi migrants. Implemented secure onboarding, scheduling, payments, and multilingual content workflows.",
    tech: "Next.js · Tailwind · FastAPI · PostgreSQL · Stripe · Cloud Run",
    mockupSrc: "/mockup/mockup_probashicare.png",
  },
  {
    id: "lifestory",
    name: "Lifestory",
    role: "Full-stack Developer",
    period: "2023 – 2025",
    headline: "Story-driven wellness app across web and mobile.",
    description:
      "Shipped core features for journaling and guided reflections across Vue web and Flutter mobile apps. Focused on realtime content sync, offline support, and a clean, emotionally resonant UI.",
    tech: "Vue 3 · Nuxt · Flutter · Firebase · Cloud Functions · Figma",
    mockupSrc: "/mockup/mockup_lifestory.png",
  },
  {
    id: "rini",
    name: "Rini AI",
    role: "ML Engineer / Backend",
    period: "2023 – 2024",
    headline: "Credit scoring engine for thin-file borrowers.",
    description:
      "Productionised a gradient-boosting credit scoring model and wrapped it with auditable APIs. Designed feature pipelines, backtesting tooling, and monitoring for drift and model performance.",
    tech: "Python · XGBoost · Pandas · FastAPI · PostgreSQL · Prefect",
    mockupSrc: "/mockup/mockup_rini.png",
  },
  {
    id: "vaultt",
    name: "Vaultt",
    role: "Full-stack Engineer",
    period: "2022 – 2023",
    headline: "Personal data and document vault for families.",
    description:
      "Built secure sharing flows, permissions, and family-oriented interfaces for storing sensitive documents and information in one place.",
    tech: "React · Next.js · Node · PostgreSQL · AWS",
    mockupSrc: "/mockup/mockup_vaultt.png",
  },
  {
    id: "cs2trading",
    name: "CS2 Trading Tools",
    role: "Frontend Engineer",
    period: "2021 – 2022",
    headline: "Trading helpers and dashboards for CS2 economy.",
    description:
      "Designed and implemented interfaces for tracking and analysing CS2 skins and marketplace movements with responsive, realtime dashboards.",
    tech: "React · Next.js · Tailwind · WebSockets",
    mockupSrc: "/mockup/mockup_cs2trading.png",
  },
  {
    id: "bop",
    name: "BOP Global",
    role: "Frontend / Product Engineer",
    period: "2020 – 2022",
    headline: "Campaign and storytelling sites for purpose-driven work.",
    description:
      "Shipped a series of campaign sites and landing experiences for BOP Global and partners, emphasising fast performance and bold typography.",
    tech: "Next.js · Tailwind · GSAP · Vercel",
    mockupSrc: "/mockup/mockup_bop.png",
  },
];

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLElement | null>(null);

  // carousel state
  const [prev, setPrev] = useState<number | null>(null);
  const [animating, setAnimating] = useState(false);
  const prevMockRef = useRef<HTMLDivElement | null>(null);
  const currentMockRef = useRef<HTMLDivElement | null>(null);
  const detailsRef = useRef<HTMLDivElement | null>(null);
  const directionRef = useRef<1 | -1>(1);

  // wheel refs
  const wheelInnerRef = useRef<HTMLDivElement | null>(null);

  // constants
  const len = PROJECTS.length;
  const VISIBLE = 5;
  const CENTER = Math.floor(VISIBLE / 2); // 2
  const ITEM_H = 56; // adjust if you change paddings/sizes

  // guard (prevents undefined crashes ever)
  if (!len) return null;

  // make an infinite wheel by tripling items
  const EXT = useMemo(() => [...PROJECTS, ...PROJECTS, ...PROJECTS], [len]);
  const middleBase = len; // beginning of the middle copy

  // wheelIndex is the "active row" inside EXT
  const [wheelIndex, setWheelIndex] = useState<number>(() => middleBase);

  // derive active project index (0..len-1)
  const active = ((wheelIndex % len) + len) % len;
  const project = PROJECTS[active];

  // pin the whole section
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const st = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "+=100%",
      pin: true,
      pinSpacing: true,
    });
    return () => st.kill();
  }, []);

  // wheel animation (scroll the list so active row is centered)
  useEffect(() => {
    const inner = wheelInnerRef.current;
    if (!inner) return;

    setAnimating(true);

    const y = -((wheelIndex - CENTER) * ITEM_H);

    gsap.to(inner, {
      y,
      duration: 0.55,
      ease: "power4.inOut",
      onComplete: () => {
        // recenter into middle copy to keep infinite loop (no jump)
        const min = len; // start of middle copy
        const max = len * 2; // end (exclusive)
        if (wheelIndex < min || wheelIndex >= max) {
          const normalized = ((wheelIndex % len) + len) % len; // 0..len-1
          const recentered = middleBase + normalized;
          setWheelIndex(recentered);
          gsap.set(inner, { y: -((recentered - CENTER) * ITEM_H) });
        }
        // end "busy" state slightly after to avoid spam-clicks
        setTimeout(() => setAnimating(false), 50);
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wheelIndex]);

  // mockup slide transition (direction-aware)
  useEffect(() => {
    if (prev === null) return;
    const prevEl = prevMockRef.current;
    const currEl = currentMockRef.current;
    if (!prevEl || !currEl) return;

    const dir = directionRef.current; // 1 down, -1 up
    const prevTo = dir === 1 ? -100 : 100;
    const currFrom = dir === 1 ? 100 : -100;

    gsap.set(currEl, { xPercent: currFrom, autoAlpha: 1 });

    const tl = gsap.timeline({
      onComplete: () => setPrev(null),
    });

    tl.to(prevEl, { xPercent: prevTo, autoAlpha: 0, duration: 0.7, ease: "power4.inOut" }, 0);
    tl.to(currEl, { xPercent: 0, duration: 0.7, ease: "power4.inOut" }, 0);
  }, [prev]);

  // details animation on active change
  useEffect(() => {
    const card = detailsRef.current;
    if (!card) return;
    const chunks = card.querySelectorAll<HTMLElement>(".project-chunk");
    gsap.set(chunks, { opacity: 0, y: 12, filter: "blur(10px)" });
    gsap.to(chunks, {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      duration: 0.45,
      ease: "power2.out",
      stagger: 0.08,
    });
  }, [active]);

  // ensure wheel starts aligned without animation flash
  useEffect(() => {
    const inner = wheelInnerRef.current;
    if (!inner) return;
    gsap.set(inner, { y: -((wheelIndex - CENTER) * ITEM_H) });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goStep = (dir: 1 | -1) => {
    if (animating) return;
    directionRef.current = dir;
    setPrev(active);
    setWheelIndex((x) => x + dir);
  };

  const goToOffset = (offset: number) => {
    if (!offset || animating) return;
    directionRef.current = offset > 0 ? 1 : -1;
    setPrev(active);
    setWheelIndex((x) => x + offset);
  };

  // visible rows are always around wheelIndex
  const visibleRowIndices = Array.from({ length: VISIBLE }).map(
    (_, slot) => wheelIndex + (slot - CENTER)
  );

  return (
    <section
      id="projects-carousel"
      ref={sectionRef}
      className="relative h-screen w-screen bg-section-bg text-foreground"
    >
      <div className="absolute inset-0 flex flex-col md:flex-row">
        {/* Left: wheel pagination */}
        <div className="w-full md:w-1/4 flex items-center justify-start">
          <div className="flex flex-col items-center w-full px-0">
            <button
              type="button"
              aria-label="Previous project"
              onClick={() => goStep(-1)}
              className="text-text-muted-2 hover:text-foreground transition-colors"
            >
              <ChevronUp className="w-4 h-4 mb-6 cursor-pointer" />
            </button>

            <div
              className="relative overflow-hidden w-full"
              style={{ height: ITEM_H * VISIBLE }}
            >
              <div ref={wheelInnerRef} className="will-change-transform">
                {EXT.map((p, i) => {
                  const isActiveRow = i === wheelIndex;
                  const distance = Math.abs(i - wheelIndex);

                  // only rows near center should be clickable to feel "picker-like"
                  const isNear = distance <= CENTER;

                  return (
                    <button
                      key={`${p.id}-${i}`}
                      type="button"
                      onClick={() => {
                        if (!isNear) return;
                        goToOffset(i - wheelIndex);
                      }}
                      className="w-full text-left"
                      style={{ height: ITEM_H }}
                      aria-current={isActiveRow ? "true" : "false"}
                    >
                      <div
                        className={`
                          flex items-center justify-between w-full border
                          px-4 py-2 ${dmMono.className} tracking-[0.22em]
                          transition-all duration-300
                          ${
                            isActiveRow
                              ? "bg-white text-[#101318] border-border-subtle shadow-sm"
                              : "bg-transparent text-text-muted border-transparent"
                          }
                        `}
                        style={{
                          opacity: isActiveRow ? 1 : distance === 1 ? 0.72 : 0.45,
                          transform:
                            distance === 0
                              ? "scale(1)"
                              : distance === 1
                              ? "scale(0.98)"
                              : "scale(0.96)",
                        }}
                      >
                        <span
                          className={`truncate ${
                            isActiveRow ? "text-sm md:text-base" : "text-xs md:text-sm"
                          }`}
                        >
                          {p.name}
                        </span>
                        <span className="ml-2 text-[10px] text-text-muted-2">
                          {String((((i % len) + len) % len) + 1).padStart(2, "0")}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* fade mask */}
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-section-bg to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-section-bg to-transparent" />
              </div>

              {/* selection band (subtle) */}
              <div
                className="pointer-events-none absolute left-0 right-0"
                style={{
                  top: CENTER * ITEM_H,
                  height: ITEM_H,
                }}
              />
            </div>

            <button
              type="button"
              aria-label="Next project"
              onClick={() => goStep(1)}
              className="mt-6 text-text-muted-2 hover:text-foreground transition-colors"
            >
              <ChevronDown className="w-4 h-4 cursor-pointer" />
            </button>
          </div>
        </div>

        {/* Center: mockup */}
        <div className="w-full md:w-2/4 flex items-center justify-center px-0">
          <div className="relative w-full h-full">
            <div className="absolute inset-0 overflow-hidden">
              {prev !== null && (
                <div ref={prevMockRef} className="absolute inset-0">
                  <Image
                    src={PROJECTS[prev].mockupSrc}
                    alt={PROJECTS[prev].name}
                    fill
                    className="object-cover"
                    sizes="100vw"
                    priority
                  />
                </div>
              )}
              <div key={project.id} ref={currentMockRef} className="absolute inset-0">
                <Image
                  src={project.mockupSrc}
                  alt={project.name}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: details */}
        <div className="w-full md:w-1/4 flex items-center justify-center">
          <div
            ref={detailsRef}
            className="max-w-xs w-full mx-4 md:mx-6 px-5 py-6 md:py-8 space-y-4 bg-white/95 rounded-3xl border border-border-subtle shadow-sm backdrop-blur-sm"
          >
            <div
              className={`project-chunk text-[11px] tracking-[0.28em] text-text-muted ${dmMono.className} uppercase`}
            >
              CASE STUDY
            </div>
            <h2
              className={`${spaceGrotesk.className} project-chunk text-2xl md:text-3xl font-semibold text-[#0f172a] leading-tight`}
            >
              {project.name}
            </h2>
            <p className="project-chunk text-[#6b7280] text-[11px] md:text-xs uppercase tracking-[0.22em]">
              {project.role} · {project.period}
            </p>
            <p className="project-chunk text-[#111827] text-sm md:text-base leading-relaxed">
              {project.headline}
            </p>
            <p className="project-chunk text-[#4b5563] text-sm leading-relaxed">
              {project.description}
            </p>
            <div className="project-chunk pt-2">
              <div
                className={`text-[10px] tracking-[0.28em] text-text-muted-2 uppercase mb-1 ${dmMono.className}`}
              >
                TECH STACK
              </div>
              <p className="text-[#4b5563] text-xs md:text-sm leading-relaxed">
                {project.tech}
              </p>
            </div>

            {/* (optional) debug: remove if you don't want */}
            {/* <div className="text-[10px] text-text-muted-2">{`wheelIndex=${wheelIndex} active=${active}`}</div> */}
          </div>
        </div>
      </div>
    </section>
  );
}
