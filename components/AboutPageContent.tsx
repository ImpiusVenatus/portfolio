"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MapPin, Mail, Phone } from "lucide-react";
import TransitionLink from "@/components/TransitionLink";
import { dmMono } from "@/app/layout";

gsap.registerPlugin(ScrollTrigger);

const RESUME_URL = "/assets/Sadman's Resume.pdf";
const ENTRY_DURATION = 0.6;
const EXIT_DURATION = 0.3;

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
    label: "VP of Technology · Buckyy",
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
  const timelineSectionRef = useRef<HTMLDivElement | null>(null);
  const lineRef = useRef<HTMLDivElement | null>(null);
  const itemRowRefs = useRef<(HTMLLIElement | null)[]>([]);
  const backLinkRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const headerEl = headerRef.current;
    const sectionEl = timelineSectionRef.current;
    const lineEl = lineRef.current;
    const rows = itemRowRefs.current.filter(Boolean);
    const backEl = backLinkRef.current;
    if (!headerEl) return;

    // Header: entry when in view, exit when scrolling back up
    gsap.set(headerEl, { autoAlpha: 0, y: 24 });
    const headerIn = gsap.to(headerEl, {
      autoAlpha: 1,
      y: 0,
      duration: ENTRY_DURATION,
      ease: "power2.out",
      paused: true,
    });
    const stHeaderEnter = ScrollTrigger.create({
      trigger: headerEl,
      start: "top 82%",
      onEnter: () => headerIn.play(),
    });
    const stHeaderExit = ScrollTrigger.create({
      trigger: headerEl,
      start: "top 85%",
      onLeaveBack: () => gsap.to(headerEl, { autoAlpha: 0, y: -16, duration: EXIT_DURATION, ease: "power2.in" }),
    });
    // If header is already in view on load, play entry
    requestAnimationFrame(() => {
      if (headerEl.getBoundingClientRect().top < window.innerHeight * 0.85) headerIn.play();
    });

    if (!sectionEl || !lineEl) return;

    // Timeline: line + dots + content reveal as user scrolls (scrub)
    gsap.set(lineEl, { scaleY: 0, transformOrigin: "top" });
    rows.forEach((el) => gsap.set(el, { autoAlpha: 0, y: 14 }));
    if (backEl) gsap.set(backEl, { autoAlpha: 0, y: 10 });

    const numItems = rows.length;
    const lineProgress = 0.08;
    const itemSpan = (1 - lineProgress - 0.08) / numItems; // leave 0.08 for back link
    const scrubTl = gsap.timeline({ paused: true });
    scrubTl.to(lineEl, { scaleY: 1, duration: 1, ease: "none" }, 0);
    rows.forEach((el, i) => {
      scrubTl.to(
        el,
        { autoAlpha: 1, y: 0, duration: 1, ease: "power2.out" },
        lineProgress + i * itemSpan
      );
    });
    if (backEl) {
      scrubTl.to(backEl, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" }, 1 - 0.06);
    }

    const scrollTrigger = ScrollTrigger.create({
      trigger: sectionEl,
      start: "top 78%",
      end: "bottom 22%",
      scrub: true,
      animation: scrubTl,
    });

    return () => {
      scrollTrigger.kill();
      stHeaderEnter.kill();
      stHeaderExit.kill();
      headerIn.kill();
      scrubTl.kill();
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
        <div className="flex flex-col gap-2 text-white/60 text-sm md:text-base">
          <span className="flex items-center gap-2">
            <MapPin className="shrink-0 w-4 h-4 text-white/50" aria-hidden />
            Dhaka, Bangladesh
          </span>
          <span className="flex items-center gap-2">
            <Mail className="shrink-0 w-4 h-4 text-white/50" aria-hidden />
            josephitesadman56@gmail.com
          </span>
          <span className="flex items-center gap-2">
            <Phone className="shrink-0 w-4 h-4 text-white/50" aria-hidden />
            +8801717158743
          </span>
        </div>
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

      <div ref={timelineSectionRef} className="relative">
        {/* Vertical line — draws as user scrolls */}
        <div
          ref={lineRef}
          className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-gradient-to-b from-white/20 via-white/30 to-white/20"
          aria-hidden
        />
        {/* Timeline items: line, dot and text reveal on scroll */}
        <ul className="space-y-0">
          {TIMELINE_ITEMS.map((item, i) => (
            <li
              key={i}
              ref={(el) => { itemRowRefs.current[i] = el; }}
              className="relative flex items-start py-8 min-h-[5rem]"
            >
              <div className={`flex-1 pr-6 ${item.side === "left" ? "text-right" : ""}`}>
                {item.side === "left" && (
                  <div>
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
                  <div>
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

      <div ref={backLinkRef} className="pt-12">
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
