"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { dmMono, spaceGrotesk } from "@/app/layout";
import { ChevronDown } from "lucide-react";
import FloatingTechLogos from "@/components/FloatingTechLogos";

gsap.registerPlugin(ScrollTrigger);

type ServiceCard = { label: string; meta: string; stack: string };

type Service = {
  id: string;
  title: string;
  short: string;
  ctaLabel: string;
  ctaHref: string;
  cards: ServiceCard[];
};

const SERVICES: Service[] = [
  {
    id: "frontend",
    title: "Frontend & Design",
    short:
      "Premium UI implementation with smooth motion, clean typography, and fast performance. Built to feel expensive — and stay maintainable.",
    ctaLabel: "DISCUSS A FRONTEND",
    ctaHref: "/contact",
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
    ctaHref: "/contact",
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
    ctaHref: "/contact",
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
    ctaHref: "/contact",
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
    ctaHref: "/contact",
    cards: [
      { label: "Landing Copy", meta: "Clear value proposition, CTA", stack: "Copy • Structure • Tone" },
      { label: "SEO Basics", meta: "On-page optimization + performance", stack: "SEO • Core Web Vitals" },
      { label: "Analytics Setup", meta: "Track what matters, iterate faster", stack: "Events • Funnels • A/B" },
    ],
  },
];

export default function ServicesPageContent() {
  const introRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  // Intro: title words and subtitle animate in on load
  useEffect(() => {
    const title = titleRef.current;
    const subtitle = subtitleRef.current;
    if (!title || !subtitle) return;

    const letters = title.querySelectorAll(".letter");
    gsap.set([...letters, subtitle], { opacity: 0, y: 24 });
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.to(letters, { opacity: 1, y: 0, duration: 0.6, stagger: 0.04 });
    tl.to(subtitle, { opacity: 1, y: 0, duration: 0.5 }, "-=0.3");
  }, []);

  // Scroll progress line (left edge): grows with scroll through service blocks
  useEffect(() => {
    const line = progressLineRef.current;
    if (!line) return;

    const st = ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.3,
      onUpdate: (self) => {
        line.style.transform = `scaleY(${self.progress})`;
      },
    });
    return () => st.kill();
  }, []);

  // Per-section: ordinal, title, description, cards with unique entrances
  useEffect(() => {
    const sections = sectionRefs.current.filter(Boolean) as HTMLElement[];
    const ctx = gsap.context(() => {
      sections.forEach((section, i) => {
        const ordinal = section.querySelector("[data-ordinal]");
        const heading = section.querySelector("[data-heading]");
        const desc = section.querySelector("[data-desc]");
        const cards = section.querySelectorAll<HTMLElement>("[data-card]");
        const line = section.querySelector<HTMLElement>("[data-line]");

        gsap.set([ordinal, heading, desc, ...cards, line], { opacity: 0 });
        if (ordinal) gsap.set(ordinal, { scale: 0.6 });
        if (line) gsap.set(line, { scaleX: 0 });
        if (heading) gsap.set(heading, { y: 28 });
        if (desc) gsap.set(desc, { y: 28 });
        cards.forEach((card) => {
          gsap.set(card, { y: 40, rotateX: -12 });
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 82%",
            end: "top 30%",
            toggleActions: "play none none none",
          },
        });

        tl.to(ordinal, { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.2)" }, 0);
        tl.to(line, { opacity: 1, scaleX: 1, duration: 0.6, ease: "power2.out", transformOrigin: "left center" }, 0.1);
        tl.to(heading, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, 0.15);
        tl.to(desc, { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }, 0.25);
        // Cards: alternating slide-up with slight 3D tilt release
        cards.forEach((card, j) => {
          tl.to(
            card,
            { opacity: 1, y: 0, rotateX: 0, duration: 0.5, ease: "power2.out" },
            0.35 + j * 0.12
          );
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* Intro: full viewport height so scroll triggers below fire at the right time */}
      <section
        ref={introRef}
        className="relative h-screen flex flex-col items-center justify-center text-center px-6 bg-section-bg overflow-hidden"
      >
        <FloatingTechLogos containerRef={introRef} />
        <div className="relative z-10">
        <p className={`text-[10px] tracking-[0.28em] text-text-muted uppercase ${dmMono.className} mb-4`}>
          WHAT I OFFER
        </p>
        <h1 ref={titleRef} className={`${spaceGrotesk.className} uppercase text-4xl sm:text-5xl md:text-6xl lg:text-[164px] font-bold text-heading tracking-tight max-w-4xl`}>
          {"Services".split("").map((char, i) => (
            <span key={i} className="letter inline-block">
              {char}
            </span>
          ))}
        </h1>
        <p
          ref={subtitleRef}
          className="mt-6 max-w-xl text-text-muted text-base md:text-lg leading-relaxed"
        >
          From frontend and backend to product and growth - focused on shipping clean, scalable work.
        </p>
        </div>
      </section>

      {/* Progress line (fixed left edge) */}
      <div
        ref={progressLineRef}
        className="fixed left-0 top-0 w-0.5 h-full bg-heading/30 origin-top z-0 pointer-events-none"
        style={{ transform: "scaleY(0)" }}
        aria-hidden
      />

      {/* Service blocks */}
      <div className="relative z-10 bg-page-bg">
        {SERVICES.map((service, i) => (
          <section
            key={service.id}
            ref={(el) => {
              sectionRefs.current[i] = el;
            }}
            className="relative py-20 md:py-28 px-6 md:px-12 lg:px-20 border-t border-border-subtle"
          >
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
                {/* Left: ordinal + title + description */}
                <div className="lg:col-span-5">
                  <span
                    data-ordinal
                    className={`block text-[clamp(4rem,12vw,8rem)] font-bold leading-none text-heading/15 ${spaceGrotesk.className}`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div
                    data-line
                    className="mt-2 h-1 w-16 bg-heading rounded-full origin-left"
                  />
                  <h2
                    data-heading
                    className={`mt-6 ${spaceGrotesk.className} text-3xl md:text-4xl lg:text-5xl font-bold text-heading leading-tight`}
                  >
                    {service.title}
                  </h2>
                  <p data-desc className="mt-6 text-text-muted leading-relaxed max-w-lg">
                    {service.short}
                  </p>
                  <Link
                    href={service.ctaHref}
                    className={`group mt-8 inline-flex items-center gap-2 ${dmMono.className} text-xs tracking-[0.2em] text-text-muted hover:text-heading transition-colors`}
                  >
                    {service.ctaLabel}
                    <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
                  </Link>
                </div>

                {/* Right: cards with perspective / stagger */}
                <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                  {service.cards.map((card) => (
                    <div
                      key={card.label}
                      data-card
                      className="group relative p-6 rounded-2xl bg-section-bg border border-border-subtle shadow-sm hover:shadow-md hover:border-heading/20 transition-all duration-300"
                    >
                      <div className="text-[10px] tracking-[0.2em] text-text-muted-2 uppercase mb-2">
                        {card.label}
                      </div>
                      <p className="text-heading font-medium text-sm md:text-base">{card.meta}</p>
                      <p className={`mt-2 text-text-muted-2 text-xs ${dmMono.className}`}>
                        {card.stack}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ))}
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
    </>
  );
}
