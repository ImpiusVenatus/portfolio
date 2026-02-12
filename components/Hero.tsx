"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { dmMono, spaceGrotesk } from "@/app/layout";
import { Compare } from "./ui/compare";
import AnimatedTitle from "./AnimatedTitle";
import { IconSparkles } from "@tabler/icons-react";

gsap.registerPlugin(ScrollTrigger);

const MD_BREAKPOINT = 768;

export default function Hero() {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef<HTMLElement | null>(null);

  // Left panel (off-white with diagonal edge)
  const leftPanelRef = useRef<HTMLDivElement | null>(null);
  const leftContentRef = useRef<HTMLDivElement | null>(null);

  // Left-side content refs for entry animation
  const logoRef = useRef<HTMLDivElement | null>(null);
  const titleRef = useRef<HTMLParagraphElement | null>(null);
  const placeholderImgRef = useRef<HTMLDivElement | null>(null);
  const descRef = useRef<HTMLParagraphElement | null>(null);
  const ctaRef = useRef<HTMLAnchorElement | null>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement | null>(null);

  // From Idea to Production + Compare (triggered when bg fully visible)
  const processTextRef = useRef<HTMLDivElement | null>(null);
  const fromRef = useRef<HTMLDivElement | null>(null);
  const toRef = useRef<HTMLDivElement | null>(null);
  const prodRef = useRef<HTMLDivElement | null>(null);
  const compareWrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (
      !sectionRef.current ||
      !leftPanelRef.current ||
      !processTextRef.current ||
      !fromRef.current ||
      !toRef.current ||
      !prodRef.current ||
      !compareWrapRef.current
    )
      return;

    let heroCompleteFired = false;
    let ideaProductionTriggered = false;

    const ctx = gsap.context(() => {
      const sectionEl = sectionRef.current!;
      const leftPanel = leftPanelRef.current!;
      const processEl = processTextRef.current!;
      const fromEl = fromRef.current!;
      const toEl = toRef.current!;
      const prodEl = prodRef.current!;
      const compareEl = compareWrapRef.current!;

      // Initial: FROM IDEA + Compare hidden
      gsap.set(processEl, { autoAlpha: 0 });
      gsap.set([fromEl, toEl, prodEl], {
        autoAlpha: 0,
        y: 10,
        filter: "blur(10px)",
      });
      gsap.set(compareEl, {
        autoAlpha: 0,
        y: 12,
        filter: "blur(10px)",
      });

      // ScrollTrigger: left panel slides out, top faster than bottom
      ScrollTrigger.create({
        id: "hero-pin",
        trigger: sectionEl,
        start: "top top",
        end: "+=200%",
        scrub: true,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,

        onUpdate: (self) => {
          const p = self.progress;
          const mobile = typeof window !== "undefined" && window.innerWidth < MD_BREAKPOINT;

          if (mobile) {
            // Mobile: no diagonal; left panel fades to reveal hero bg
            leftPanel.style.clipPath = "none";
            leftPanel.style.opacity = String(Math.max(0, 1 - p * 2));
            // Hide Compare on mobile
            gsap.set(compareEl, { autoAlpha: 0 });
          } else {
            // Desktop: angular diagonal
            leftPanel.style.opacity = "1";
            const topDoneAt = 0.6;
            const topX =
              p < topDoneAt
                ? 73 - (p / topDoneAt) * 93
                : -25;
            const bottomX = 38 - p * 58;
            const clipPath = `polygon(0 0, ${topX}% 0, ${Math.max(bottomX, -25)}% 100%, 0 100%)`;
            leftPanel.style.clipPath = clipPath;

            // Scroll indicator (desktop only)
            const scrollInd = scrollIndicatorRef.current;
            if (scrollInd) {
              const scale = Math.max(0, 1 - p * 3);
              scrollInd.style.transform = `translate(-50%, -50%) scale(${scale})`;
              scrollInd.style.opacity = String(scale);
            }
          }

          window.dispatchEvent(
            new CustomEvent("hero:progress", { detail: { progress: p } })
          );

          // Show FROM IDEA (center on mobile) + Compare (desktop only) when bg visible
          if (!ideaProductionTriggered && p >= 0.55) {
            ideaProductionTriggered = true;
            gsap.to(fromEl, {
              autoAlpha: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 0.35,
              ease: "power2.out",
            });
            gsap.to(toEl, {
              autoAlpha: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 0.25,
              ease: "power2.out",
              delay: 0.12,
            });
            gsap.to(prodEl, {
              autoAlpha: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 0.35,
              ease: "power2.out",
              delay: 0.22,
            });
            if (!mobile) {
              gsap.to(compareEl, {
                autoAlpha: 1,
                y: 0,
                filter: "blur(0px)",
                duration: 0.45,
                ease: "power2.out",
                delay: 0.35,
              });
            }
          }

          // Visibility: smooth fade when scrolling up (0.5–0.58), fade out when exiting (p >= 0.82)
          if (p < 0.5) {
            gsap.set(processEl, { autoAlpha: 0 });
          } else if (p < 0.58) {
            const fadeUp = (p - 0.5) / 0.08; // 0→1 as we scroll down through this zone
            gsap.set(processEl, { autoAlpha: fadeUp });
          } else if (p >= 0.82) {
            const exitP = (p - 0.82) / 0.18;
            gsap.set(processEl, { autoAlpha: 1 - exitP });
          } else {
            gsap.set(processEl, { autoAlpha: 1 });
          }

          if (!heroCompleteFired && p >= 0.98) {
            heroCompleteFired = true;
            window.dispatchEvent(new CustomEvent("hero:complete"));
          }
        },
      });

      // Fade out left content as panel slides
      ScrollTrigger.create({
        trigger: sectionEl,
        start: "top top",
        end: "+=200%",
        scrub: true,
        onUpdate: (self) => {
          if (leftContentRef.current) {
            const opacity = Math.max(0, 1 - self.progress * 2.5);
            leftContentRef.current.style.opacity = String(opacity);
          }
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Fix circle position when returning from another page — force ScrollTrigger sync
  useEffect(() => {
    if (!mounted || !scrollIndicatorRef.current) return;
    const t = setTimeout(() => {
      ScrollTrigger.refresh();
      const st = ScrollTrigger.getById("hero-pin");
      if (st && scrollIndicatorRef.current) {
        const p = st.progress;
        const scale = Math.max(0, 1 - p * 3);
        scrollIndicatorRef.current.style.transform = `translate(-50%, -50%) scale(${scale})`;
        scrollIndicatorRef.current.style.opacity = String(scale);
      }
    }, 100);
    return () => clearTimeout(t);
  }, [mounted]);

  // Entry animation for left panel content (after preloader)
  useEffect(() => {
    const logo = logoRef.current;
    const title = titleRef.current;
    const img = placeholderImgRef.current;
    const desc = descRef.current;
    const cta = ctaRef.current;
    const scroll = scrollIndicatorRef.current;
    if (!logo || !img) return;

    const els = [logo, title, img, desc, cta, scroll].filter(Boolean);
    gsap.set(els, { autoAlpha: 0, y: 20 });

    const runEntry = () => {
      const tl = gsap.timeline();
      tl.to(logo, { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" }, 0);
      tl.to(title, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" }, 0.1);
      tl.to(img, { autoAlpha: 1, y: 0, duration: 0.7, ease: "power2.out" }, 0.15);
      tl.to(desc, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" }, 0.25);
      tl.to(cta, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" }, 0.35);
      tl.to(scroll, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" }, 0.45);
    };

    if (typeof window !== "undefined" && sessionStorage.getItem("preloaderDone")) {
      runEntry();
      return;
    }

    const handler = () => runEntry();
    window.addEventListener("preloader:complete", handler);
    return () => window.removeEventListener("preloader:complete", handler);
  }, []);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const check = () => setIsMobile(typeof window !== "undefined" && window.innerWidth < MD_BREAKPOINT);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <>
    <section
      id="hero"
      ref={sectionRef}
      className="relative h-screen overflow-hidden"
    >
      {/* Hero background image with overlay - theme-aware */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-card-light.png"
          alt=""
          fill
          priority
          className="object-cover dark:hidden"
        />
        <Image
          src="/hero-card.png"
          alt=""
          fill
          priority
          className="object-cover hidden dark:block"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Left panel: theme-aware bg (off-white light / dark dark); full on mobile, diagonal on desktop */}
      <div
        ref={leftPanelRef}
        className="absolute inset-0 z-10 bg-[#F4F1D8] dark:bg-[#101318] max-md:[clip-path:none]"
        style={
          isMobile
            ? undefined
            : { clipPath: "polygon(0 0, 73% 0, 38% 100%, 0 100%)" }
        }
      >
        <div
          ref={leftContentRef}
          className="relative h-full flex flex-col items-start justify-center px-12 lg:px-20"
        >
          {/* Logo / branding - theme-aware contrast */}
          <div ref={logoRef} className="mb-6">
            <h2
              className={`${spaceGrotesk.className} text-6xl lg:text-7xl font-bold text-[#1a1a1a] dark:text-[#f4f1d8] tracking-tight uppercase`}
            >
              Md Sadman Hossain
            </h2>
            <AnimatedTitle ref={titleRef} className={`${dmMono.className} text-sm tracking-[0.2em] text-[#1a1a1a]/70 dark:text-[#f4f1d8]/70 mt-2`} />
          </div>

          {/* Placeholder image (carousel later) - theme-aware */}
          <div ref={placeholderImgRef} className="mb-6">
            <div className="relative w-full max-w-md aspect-[4/3] rounded-lg overflow-hidden shadow-xl border border-[#1a1a1a]/20 dark:border-white/20">
              <Image
                src="/hero-card-light.png"
                alt="Work preview"
                fill
                className="object-cover dark:hidden"
              />
              <Image
                src="/hero-card.png"
                alt="Work preview"
                fill
                className="object-cover hidden dark:block"
              />
            </div>
          </div>

          {/* Description text - theme-aware contrast */}
          <p
            ref={descRef}
            className="text-base lg:text-lg text-[#1a1a1a]/70 dark:text-[#f4f1d8]/70 leading-relaxed max-w-md mb-6"
          >
            Transforming ideas into production-ready software with clean code,
            modern architecture, and attention to detail.
          </p>

          {/* CTA button - theme-aware */}
          <a
            ref={ctaRef}
            href="#projects"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a1a1a] dark:bg-[#f4f1d8] text-white dark:text-[#101318] text-base font-medium tracking-wide border-2 border-[#1a1a1a] dark:border-[#f4f1d8] rounded-md hover:bg-transparent hover:text-[#1a1a1a] dark:hover:bg-transparent dark:hover:text-[#f4f1d8] transition-colors w-fit"
          >
            <IconSparkles className="w-4 h-4" />
            VIEW MY WORK
          </a>
        </div>
      </div>

      {/* FROM IDEA to PRODUCTION + Compare — shown when bg fully visible; centered on mobile */}
      <div
        ref={processTextRef}
        className="fixed inset-0 z-[200] pointer-events-none opacity-0"
      >
        <div className="absolute left-24 top-1/2 -translate-y-1/2 max-md:left-1/2 max-md:-translate-x-1/2 max-md:text-center">
          <div className={`${spaceGrotesk.className} text-[#F4F1D8] tracking-tight`}>
            <div ref={fromRef} className="text-6xl md:text-[140px] lg:text-[160px] leading-none font-bold uppercase">
              From Idea
            </div>
            <div ref={toRef} className="text-2xl md:text-[56px] lg:text-[64px] leading-none mt-4 text-white/70">
              to
            </div>
            <div ref={prodRef} className="text-6xl md:text-[140px] lg:text-[160px] leading-none font-bold mt-4 uppercase">
              Production
            </div>
          </div>
        </div>

        <div
          ref={compareWrapRef}
          className="absolute right-24 top-1/2 -translate-y-1/2 p-4 border rounded-3xl dark:bg-neutral-900 bg-neutral-100 border-neutral-200 dark:border-neutral-800 pointer-events-auto max-md:hidden"
        >
          <Compare
            firstImage="https://assets.aceternity.com/code-problem.png"
            secondImage="https://assets.aceternity.com/code-solution.png"
            firstImageClassName="object-cover object-left-top"
            secondImageClassname="object-cover object-left-top"
            className="h-[250px] w-[200px] md:h-[500px] md:w-[500px]"
            slideMode="hover"
          />
        </div>
      </div>
    </section>
    {mounted && typeof document !== "undefined" && createPortal(
      <div
        ref={scrollIndicatorRef}
        className="fixed left-[60%] top-[55%] -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none w-36 h-36 rounded-full bg-[#101318]/90 dark:bg-[#F4F1D8]/90 backdrop-blur-sm max-md:hidden"
        style={{ transformOrigin: "center center" }}
      >
        <div
          className="absolute inset-0 overflow-hidden rounded-full"
          style={{ animation: "hero-scroll-spin 20s linear infinite" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/icons/hero-circle.svg"
            alt=""
            width={112}
            height={112}
            className="w-full h-full object-contain invert dark:invert-0 dark:opacity-90"
          />
        </div>
        <span
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 ${spaceGrotesk.className} text-2xl font-bold text-[#f4f1d8] dark:text-[#1a1a1a]`}
        >
          IV
        </span>
      </div>,
      document.body
    )}
    </>
  );
}
