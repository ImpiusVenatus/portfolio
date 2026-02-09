"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import TransitionLink from "@/components/TransitionLink";
import { dmMono } from "@/app/layout";

const RESUME_URL = "/assets/Sadman's Resume.pdf";
const ENTRY_DELAY_MS = 120;
const ENTRY_DURATION = 0.5;
const ENTRY_STAGGER = 0.08;

const TIMELINE_ITEMS: { side: "left" | "right"; label: string; content: React.ReactNode }[] = [
  {
    side: "left",
    label: "Education",
    content: (
      <ul className="space-y-3 text-white/80 text-sm">
        <li>
          <div className="font-semibold text-white">Chittagong University of Engineering and Technology</div>
          <div className="text-white/60">BSc in Computer Science and Engineering · March 2022 – Present</div>
        </li>
        <li>
          <div className="font-semibold text-white">Notre Dame College</div>
          <div className="text-white/60">Science · June 2018 – Dec 2020</div>
        </li>
        <li>
          <div className="font-semibold text-white">St. Joseph Higher Secondary School</div>
          <div className="text-white/60">Science · Jan 2010 – Feb 2018</div>
        </li>
      </ul>
    ),
  },
  {
    side: "right",
    label: "VP Technology · Buckyy",
    content: (
      <div className="text-sm">
        <div className="text-white/50 mb-2">Mar 2025 – Present</div>
        <ul className="text-white/70 space-y-1 list-disc list-inside">
          <li>Technology roadmap; AI-driven risk scoring (Rini); 50% fewer manual underwriting dependencies.</li>
          <li>Led mobile, backend, ML; 30% API throughput improvement.</li>
        </ul>
      </div>
    ),
  },
  {
    side: "left",
    label: "Technical Lead · Buckyy",
    content: (
      <div className="text-sm">
        <div className="text-white/50 mb-2">Mar 2024 – Mar 2025</div>
        <ul className="text-white/70 space-y-1 list-disc list-inside">
          <li>FastAPI + PostgreSQL; Rini AI scoring (12–15% stability gain).</li>
          <li>CI/CD, schema/migrations, mentored junior engineers.</li>
        </ul>
      </div>
    ),
  },
  {
    side: "right",
    label: "Full Stack Developer · Lifestory",
    content: (
      <div className="text-sm">
        <div className="text-white/50 mb-2">Dec 2023 – Oct 2025</div>
        <ul className="text-white/70 space-y-1 list-disc list-inside">
          <li>Vue 3 web + Flutter mobile; REST, auth, real-time; Play Store & App Store.</li>
          <li>Payments, media, notifications; standardized middleware.</li>
        </ul>
      </div>
    ),
  },
  {
    side: "left",
    label: "Key Products",
    content: (
      <ul className="text-white/70 text-sm space-y-2">
        <li><strong className="text-white">ProbashiCare</strong> — Diaspora services; FastAPI + PostgreSQL + JWT.</li>
        <li><strong className="text-white">Lifestory</strong> — Flutter + Vue; Play Store & App Store.</li>
        <li><strong className="text-white">Rini AI</strong> — Credit scoring (XGBoost); 12–15% consistency gain.</li>
        <li>Client: BOP Global, Gina Dirawi Foundation, ISM Agency, Trunk.</li>
      </ul>
    ),
  },
  {
    side: "right",
    label: "Technologies",
    content: (
      <p className="text-white/70 text-sm leading-relaxed">
        JavaScript, TypeScript, Python, SQL · Next.js, React, Vue, Tailwind, GSAP · Node, FastAPI, REST, JWT · Flutter, React Native · PostgreSQL, MongoDB, Firebase · Docker, K8s, Vercel, GCP, CI/CD · XGBoost, Scikit-Learn · Git, Figma
      </p>
    ),
  },
  {
    side: "left",
    label: "Languages & Interests",
    content: (
      <p className="text-white/70 text-sm">
        Bangla (Native) · English (Professional) · Creative Tech · Product Thinking · Immersive Web
      </p>
    ),
  },
];

export default function AboutPageContent() {
  const headerRef = useRef<HTMLDivElement | null>(null);
  const timelineRef = useRef<HTMLDivElement | null>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const headerEl = headerRef.current;
    const timelineEl = timelineRef.current;
    const items = itemsRef.current.filter(Boolean);
    if (!headerEl) return;

    gsap.set(headerEl, { autoAlpha: 0, y: 20 });
    gsap.set(timelineEl, { autoAlpha: 0, y: 16 });
    gsap.set(items, { autoAlpha: 0, y: 12 });

    const tl = gsap.timeline({ delay: ENTRY_DELAY_MS / 1000 });
    tl.to(headerEl, {
      autoAlpha: 1,
      y: 0,
      duration: ENTRY_DURATION,
      ease: "power2.out",
    });
    if (timelineEl) {
      tl.to(timelineEl, { autoAlpha: 1, y: 0, duration: ENTRY_DURATION, ease: "power2.out" }, ENTRY_STAGGER);
    }
    items.forEach((el, i) => {
      tl.to(el, {
        autoAlpha: 1,
        y: 0,
        duration: ENTRY_DURATION,
        ease: "power2.out",
      }, ENTRY_STAGGER * 2 + i * ENTRY_STAGGER);
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto text-left">
      <div ref={headerRef} className="space-y-4 mb-16">
        <div className={`text-[10px] tracking-[0.28em] text-white/45 ${dmMono.className}`}>
          ABOUT ME
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#F4F1D8] tracking-tight">
          Md Sadman Hossain
        </h1>
        <p className="text-white/60 text-sm md:text-base">
          Dhaka, Bangladesh · josephitesadman56@gmail.com · +8801717158743
        </p>
        <p className="text-white/70 text-lg leading-relaxed max-w-2xl">
          Software Engineer specializing in fintech and applied AI, building real-world products across digital credit, remittance and diaspora services. I design and ship production systems end-to-end—from backend architectures and frontend designs to mobile apps deployed to the Play Store and App Store.
        </p>
        <a
          href={RESUME_URL}
          download="Sadman-Hossain-Resume.pdf"
          className={`group relative mt-10 inline-flex items-center justify-center gap-2 text-white/80 hover:text-white transition-colors duration-200 ${dmMono.className} tracking-widest text-xs`}
        >
          <span className="pointer-events-none absolute -left-4 top-1/2 -translate-y-1/2 opacity-0 -translate-x-1 transition-all duration-200 ease-out group-hover:opacity-100 group-hover:translate-x-0">
            <Image src="/icons/hero-bracket.svg" alt="" width={6} height={6} className="opacity-90" />
          </span>
          <span>DOWNLOAD RESUME</span>
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

      <div ref={timelineRef} className="relative">
        {/* Vertical line */}
        <div
          className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-gradient-to-b from-white/20 via-white/30 to-white/20"
          aria-hidden
        />
        {/* Timeline items: content alternates left / right of the line */}
        <ul className="space-y-0">
          {TIMELINE_ITEMS.map((item, i) => (
            <li key={i} className="relative flex items-start py-8 min-h-[5rem]">
              <div className={`flex-1 pr-6 ${item.side === "left" ? "text-right" : ""}`}>
                {item.side === "left" && (
                  <div ref={(el) => { itemsRef.current[i] = el; }}>
                    <div className={`text-[10px] tracking-[0.28em] text-white/45 mb-2 ${dmMono.className}`}>
                      {item.label}
                    </div>
                    <div className="inline-block text-left">{item.content}</div>
                  </div>
                )}
              </div>
              <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#F4F1D8]/90 shrink-0 z-10"
                aria-hidden
              />
              <div className={`flex-1 pl-6 ${item.side === "right" ? "text-left" : ""}`}>
                {item.side === "right" && (
                  <div ref={(el) => { itemsRef.current[i] = el; }}>
                    <div className={`text-[10px] tracking-[0.28em] text-white/45 mb-2 ${dmMono.className}`}>
                      {item.label}
                    </div>
                    <div>{item.content}</div>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="pt-12">
        <TransitionLink
          href="/"
          className={`inline-flex items-center gap-2 text-white/50 hover:text-white/80 transition-colors ${dmMono.className} text-xs tracking-widest`}
        >
          ← Back to home
        </TransitionLink>
      </div>
    </div>
  );
}
