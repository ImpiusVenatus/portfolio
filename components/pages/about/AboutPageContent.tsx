"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MapPin, Mail, Phone, ChevronDown } from "lucide-react";
import TransitionLink from "@/components/TransitionLink";
import { dmMono, raderFont } from "@/app/layout";

gsap.registerPlugin(ScrollTrigger);

const RESUME_URL = "/assets/Sadman's Resume.pdf";
const ENTRY_DURATION = 0.6;
const EXIT_DURATION = 0.3;

const LOGO_SIZE = 96;
const LOGO_SIZE_SM = 80;


const TIMELINE_ITEMS: {
  side: "left" | "right";
  label: string;
  content: React.ReactNode;
  logos?: string[];
}[] = [
  {
    side: "left",
    label: "Education",
    logos: ["/logos/cuet_logo.png", "/logos/ndc_logo.png", "/logos/sjs_logo.png"],
    content: (
      <ul className="space-y-3 text-text-muted text-sm">
        <li>
          <div className="font-semibold text-foreground">Chittagong University of Engineering and Technology</div>
          <div className="text-foreground/60">BSc in Computer Science and Engineering · March 2022 – Present</div>
        </li>
        <li>
          <div className="font-semibold text-foreground">Notre Dame College</div>
          <div className="text-foreground/60">Science · June 2018 – Dec 2020</div>
        </li>
        <li>
          <div className="font-semibold text-foreground">St. Joseph Higher Secondary School</div>
          <div className="text-foreground/60">Science · Jan 2010 – Feb 2018</div>
        </li>
      </ul>
    ),
  },
  {
    side: "right",
    label: "VP of Technology · Buckyy",
    logos: ["/logos/buckyy_logo.png"],
    content: (
      <div className="text-sm">
        <div className="text-foreground/50 mb-2">Mar 2025 – Present</div>
        <ul className="text-foreground/70 space-y-1 list-disc list-inside">
          <li>Technology roadmap; AI-driven risk scoring (Rini); 50% fewer manual underwriting dependencies.</li>
          <li>Led mobile, backend, ML; 30% API throughput improvement.</li>
        </ul>
      </div>
    ),
  },
  {
    side: "left",
    label: "Technical Lead · Buckyy",
    logos: ["/logos/buckyy_logo.png"],
    content: (
      <div className="text-sm">
        <div className="text-foreground/50 mb-2">Mar 2024 – Mar 2025</div>
        <ul className="text-foreground/70 space-y-1 list-disc list-inside">
          <li>FastAPI + PostgreSQL; Rini AI scoring (12–15% stability gain).</li>
          <li>CI/CD, schema/migrations, mentored junior engineers.</li>
        </ul>
      </div>
    ),
  },
  {
    side: "right",
    label: "Full Stack Developer · Lifestory",
    logos: ["/logos/lifestory_logo.png"],
    content: (
      <div className="text-sm">
        <div className="text-foreground/50 mb-2">Dec 2023 – Oct 2025</div>
        <ul className="text-foreground/70 space-y-1 list-disc list-inside">
          <li>Vue 3 web + Flutter mobile; REST, auth, real-time; Play Store & App Store.</li>
          <li>Payments, media, notifications; standardized middleware.</li>
        </ul>
      </div>
    ),
  },
  {
    side: "left",
    label: "Key Products",
    logos: ["/logos/probashicare_logo.png", "/logos/lifestory_logo.png", "/logos/rini_logo.png"],
    content: (
      <ul className="text-foreground/70 text-sm space-y-2">
        <li><strong className="text-foreground">ProbashiCare</strong> — Diaspora services; FastAPI + PostgreSQL + JWT.</li>
        <li><strong className="text-foreground">Lifestory</strong> — Flutter + Vue; Play Store & App Store.</li>
        <li><strong className="text-foreground">Rini AI</strong> — Credit scoring (XGBoost); 12–15% consistency gain.</li>
        <li>Client: BOP Global, Gina Dirawi Foundation, ISM Agency, Trunk.</li>
      </ul>
    ),
  },
  {
    side: "right",
    label: "Technologies",
    logos: [
      "/logos/javascript_logo.png",
      "/logos/typescript_logo.png",
      "/logos/python_logo.png",
      "/logos/nextjs__logo.jpg",
      "/logos/png-transparent-js-react-js-logo-react-react-native-logos-icon-thumbnail.png",
      "/logos/vuejs_logo.png",
      "/logos/flutter_logo.jpg",
      "/logos/mongodb_logo.png",
      "/logos/docker_logo.png",
      "/logos/git_logo.png",
      "/logos/figma_logo.png",
    ],
    content: (
      <p className="text-foreground/70 text-sm leading-relaxed">
        JavaScript, TypeScript, Python, SQL · Next.js, React, Vue, Tailwind, GSAP · Node, FastAPI, REST, JWT · Flutter, React Native · PostgreSQL, MongoDB, Firebase · Docker, K8s, Vercel, GCP, CI/CD · XGBoost, Scikit-Learn · Git, Figma
      </p>
    ),
  },
  {
    side: "left",
    label: "Languages & Interests",
    content: (
      <p className="text-foreground/70 text-sm">
        Bangla (Native) · English (Professional) · Creative Tech · Product Thinking · Immersive Web
      </p>
    ),
  },
];

export default function AboutPageContent() {
  const headerRef = useRef<HTMLDivElement | null>(null);
  const detailsBlockRef = useRef<HTMLDivElement | null>(null);
  const timelineSectionRef = useRef<HTMLDivElement | null>(null);
  const lineRef = useRef<HTMLDivElement | null>(null);
  const itemRowRefs = useRef<(HTMLLIElement | null)[]>([]);
  const backLinkRef = useRef<HTMLDivElement | null>(null);
  const aboutWordRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // Build and play entry animation (words first, then details). Called when header enters view or on load if already in view.
  const playHeaderEntry = useCallback(() => {
    const headerEl = headerRef.current;
    const detailsBlock = detailsBlockRef.current;
    const words = aboutWordRefs.current.filter(Boolean) as HTMLElement[];
    if (!headerEl) return;

    gsap.set(headerEl, { autoAlpha: 0, y: 24 });
    if (detailsBlock) gsap.set(detailsBlock, { autoAlpha: 0, y: 20 });
    words.forEach((el) => gsap.set(el, { opacity: 0, y: 20 }));

    const entryTl = gsap.timeline();
    entryTl.to(headerEl, { autoAlpha: 1, y: 0, duration: 0.35, ease: "power2.out" }, 0);
    words.forEach((el, i) => {
      entryTl.to(el, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, 0.15 + 0.5 + i * 0.15);
    });
    if (detailsBlock) {
      entryTl.to(detailsBlock, { autoAlpha: 1, y: 0, duration: ENTRY_DURATION, ease: "power2.out" }, 1.35);
    }
  }, []);

  useEffect(() => {
    const headerEl = headerRef.current;
    const sectionEl = timelineSectionRef.current;
    const lineEl = lineRef.current;
    const rows = itemRowRefs.current.filter((r): r is HTMLLIElement => r != null);
    const backEl = backLinkRef.current;
    if (!headerEl) return;

    // Initial hidden state so we don't flash content before animation
    gsap.set(headerEl, { autoAlpha: 0, y: 24 });
    const detailsBlock = detailsBlockRef.current;
    if (detailsBlock) gsap.set(detailsBlock, { autoAlpha: 0, y: 20 });
    const words = aboutWordRefs.current.filter(Boolean) as HTMLElement[];
    words.forEach((el) => gsap.set(el, { opacity: 0, y: 20 }));

    const stHeaderEnter = ScrollTrigger.create({
      trigger: headerEl,
      start: "top 85%",
      onEnter: () => playHeaderEntry(),
    });
    const stHeaderExit = ScrollTrigger.create({
      trigger: headerEl,
      start: "top 85%",
      onLeaveBack: () => gsap.to(headerEl, { autoAlpha: 0, y: -16, duration: EXIT_DURATION, ease: "power2.in" }),
    });

    // If header is already in view on load, play after refs are committed (next frame)
    let cancelled = false;
    const rafId = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!cancelled && headerEl.getBoundingClientRect().top < window.innerHeight) {
          playHeaderEntry();
        }
      });
    });

    if (!sectionEl || !lineEl) {
      return () => {
        cancelled = true;
        cancelAnimationFrame(rafId);
        stHeaderEnter.kill();
        stHeaderExit.kill();
      };
    }

    const LOGO_STAGGER = 0.06;
    const CONTENT_SLIDE_DUR = 0.35;
    const numItems = rows.length;
    // Initial state: line and all rows hidden
    gsap.set(lineEl, { scaleY: 0, transformOrigin: "top" });
    rows.forEach((row) => {
      if (!row) return;
      gsap.set(row, { autoAlpha: 0 });
      const content = row.querySelector<HTMLElement>(".timeline-content");
      const logos = row.querySelectorAll<HTMLElement>(".timeline-logo");
      if (content) gsap.set(content, { opacity: 0, y: 28 });
      logos.forEach((logo) => gsap.set(logo, { opacity: 0, scale: 0.75, transformOrigin: "center center" }));
    });
    if (backEl) gsap.set(backEl, { autoAlpha: 0, y: 10 });

    // Scrub: line + all rows (including Education) so every item has same entry/exit on scroll
    const lineProgress = 0.06;
    const itemSpan = numItems > 0 ? (1 - lineProgress - 0.1) / numItems : 0;
    const scrubTl = gsap.timeline({ paused: true });
    scrubTl.to(lineEl, { scaleY: 1, duration: 0.4, ease: "power2.out" }, 0);
    rows.forEach((row, i) => {
      if (!row) return;
      const t = lineProgress + i * itemSpan;
      const content = row.querySelector<HTMLElement>(".timeline-content");
      const logos = Array.from(row.querySelectorAll<HTMLElement>(".timeline-logo"));
      scrubTl.to(row, { autoAlpha: 1, duration: 0.01 }, t);
      if (content) {
        scrubTl.to(content, { opacity: 1, y: 0, duration: CONTENT_SLIDE_DUR, ease: "power2.out" }, t + 0.02);
      }
      if (logos.length) {
        scrubTl.fromTo(
          logos,
          { opacity: 0, scale: 0.75, transformOrigin: "center center" },
          { opacity: 1, scale: 1, duration: 0.3, stagger: LOGO_STAGGER, ease: "power2.out" },
          t + 0.05
        );
      }
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
      cancelled = true;
      cancelAnimationFrame(rafId);
      scrollTrigger.kill();
      stHeaderEnter.kill();
      stHeaderExit.kill();
      scrubTl.kill();
    };
  }, [playHeaderEntry]);

  return (
    <div className="w-full max-w-4xl mx-auto text-left">
      <div ref={headerRef} className="space-y-4 mb-16">
        <div className={`text-[10px] tracking-[0.28em] text-foreground/45 ${dmMono.className}`}>
          ABOUT ME
        </div>
        {/* Header: Engineer · Builder (row 1), Solver (row 2) – word stagger animation */}
        <div className="mt-2">
          <div className="h-px bg-foreground/15 w-full" aria-hidden />
          <div className="flex flex-col gap-2 md:gap-3">
            <div className="flex flex-wrap items-baseline gap-x-8 gap-y-1">
              <span
                ref={(el) => { aboutWordRefs.current[0] = el; }}
                className={`inline-block opacity-0 text-foreground/90 ${raderFont.className}`}
                style={{ fontSize: "clamp(3.5rem, 12vw, 8rem)" }}
              >
                Engineer
              </span>
              <span
                ref={(el) => { aboutWordRefs.current[1] = el; }}
                className={`inline-block opacity-0 text-foreground/90 ${raderFont.className}`}
                style={{ fontSize: "clamp(3.5rem, 12vw, 8rem)" }}
              >
                Builder
              </span>
            </div>
            <span
              ref={(el) => { aboutWordRefs.current[2] = el; }}
              className={`inline-block opacity-0 text-foreground/90 ${raderFont.className}`}
              style={{ fontSize: "clamp(3.5rem, 12vw, 8rem)" }}
            >
              Solver
            </span>
          </div>
          <div className="h-px bg-foreground/15 w-full mt-2" aria-hidden />
        </div>
        <div ref={detailsBlockRef} className="space-y-0">
          <div className="flex flex-col gap-2 text-foreground/60 text-sm md:text-base">
            <span className="flex items-center gap-2">
              <MapPin className="shrink-0 w-4 h-4 text-foreground/50" aria-hidden />
              Dhaka, Bangladesh
            </span>
            <span className="flex items-center gap-2">
              <Mail className="shrink-0 w-4 h-4 text-foreground/50" aria-hidden />
              josephitesadman56@gmail.com
            </span>
            <span className="flex items-center gap-2">
              <Phone className="shrink-0 w-4 h-4 text-foreground/50" aria-hidden />
              +8801717158743
            </span>
          </div>
          <p className="text-foreground/70 text-lg leading-relaxed max-w-2xl mt-4">
            Software Engineer specializing in fintech and applied AI, building real-world products across digital credit, remittance and diaspora services. I design and ship production systems end-to-end—from backend architectures and frontend designs to mobile apps deployed to the Play Store and App Store.
          </p>
          <a
            href={RESUME_URL}
            download="Sadman-Hossain-Resume.pdf"
            className={`group relative mt-10 inline-flex items-center justify-center gap-2 text-text-muted hover:text-foreground transition-colors duration-200 ${dmMono.className} tracking-widest text-xs`}
          >
            <span className="pointer-events-none absolute -left-4 top-1/2 -translate-y-1/2 opacity-0 -translate-x-1 transition-all duration-200 ease-out group-hover:opacity-100 group-hover:translate-x-0">
              <Image
                src="/icons/hero-bracket.svg"
                alt=""
                width={6}
                height={6}
                className="opacity-90 invert dark:invert-0"
              />
            </span>
            <span>DOWNLOAD RESUME</span>
            <span className="inline-block text-foreground/60 transition-transform duration-300 ease-out group-hover:rotate-[360deg] group-hover:scale-110">
              ↗
            </span>
            <span className="pointer-events-none absolute -right-4 top-1/2 -translate-y-1/2 opacity-0 translate-x-1 transition-all duration-200 ease-out group-hover:opacity-100 group-hover:translate-x-0">
              <Image
                src="/icons/hero-bracket.svg"
                alt=""
                width={6}
                height={6}
                className="opacity-90 rotate-180 invert dark:invert-0"
              />
            </span>
          </a>
        </div>
      </div>

      <div ref={timelineSectionRef} className="relative">
        {/* Vertical line — draws as user scrolls */}
        <div
          ref={lineRef}
          className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-gradient-to-b from-foreground/20 via-foreground/30 to-foreground/20"
          aria-hidden
        />
        {/* Timeline items: line, dot and text reveal on scroll */}
        <ul className="space-y-0">
          {TIMELINE_ITEMS.map((item, i) => (
            <li
              key={i}
              ref={(el) => { itemRowRefs.current[i] = el; }}
              className="relative flex items-center py-8 min-h-[5rem]"
            >
              <div className={`flex-1 pr-6 flex flex-col items-end justify-center gap-3 ${item.side === "left" ? "text-right" : ""}`}>
                {item.side === "left" && (
                  <div className="timeline-content">
                    <div className={`text-[10px] tracking-[0.28em] text-foreground/45 mb-2 ${dmMono.className}`}>
                      {item.label}
                    </div>
                    <div className="inline-block text-left">{item.content}</div>
                  </div>
                )}
                {item.side === "right" && item.logos && item.logos.length > 0 && (
                  <div className="flex flex-wrap items-center justify-end gap-3 w-full">
                    {item.logos.map((src) => (
                      <span key={src} className="timeline-logo inline-flex">
                        <Image src={src} alt="" width={item.logos!.length >= 3 ? LOGO_SIZE_SM : LOGO_SIZE} height={item.logos!.length >= 3 ? LOGO_SIZE_SM : LOGO_SIZE} className="object-contain opacity-90" />
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-heading/90 shrink-0 z-10"
                aria-hidden
              />
              <div className={`flex-1 pl-6 flex flex-col items-start justify-center gap-3 ${item.side === "right" ? "text-left" : ""}`}>
                {item.side === "right" && (
                  <div className="timeline-content">
                    <div className={`text-[10px] tracking-[0.28em] text-foreground/45 mb-2 ${dmMono.className}`}>
                      {item.label}
                    </div>
                    <div>{item.content}</div>
                  </div>
                )}
                {item.side === "left" && item.logos && item.logos.length > 0 && (
                  <div className="flex flex-wrap items-center justify-start gap-3 w-full">
                    {item.logos.map((src) => (
                      <span key={src} className="timeline-logo inline-flex">
                        <Image src={src} alt="" width={item.logos!.length >= 3 ? LOGO_SIZE_SM : LOGO_SIZE} height={item.logos!.length >= 3 ? LOGO_SIZE_SM : LOGO_SIZE} className="object-contain opacity-90" />
                      </span>
                    ))}
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
          className={`inline-flex items-center gap-2 text-foreground/50 hover:text-text-muted transition-colors ${dmMono.className} text-xs tracking-widest`}
        >
          ← Back to home
        </TransitionLink>
      </div>

      {/* Scroll down hint: bottom right, arrow bounces */}
      <div
        className="fixed bottom-6 right-6 z-10 flex flex-col items-end gap-1 text-text-muted-2 pointer-events-none"
        aria-hidden
      >
        <span className={`text-[10px] tracking-[0.2em] uppercase ${dmMono.className}`}>
          Scroll down
        </span>
        <ChevronDown className="w-5 h-5 animate-bounce" strokeWidth={2} />
      </div>
    </div>
  );
}

