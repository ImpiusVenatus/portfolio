"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { dmMono } from "@/app/layout";

gsap.registerPlugin(ScrollTrigger);

const VIEWPORT_DELAY = 0.2;
const MD_BREAKPOINT = 768;

// Desktop: bigger cards, spread along the arc
const CARD_OFFSET_X = 420;
const CARD_ARC_Y = -56;
const LEFT_ROTATION = -14;
const RIGHT_ROTATION = 14;

export default function FeaturedWorkSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const centerCardRef = useRef<HTMLAnchorElement | null>(null);
  const leftCardRef = useRef<HTMLAnchorElement | null>(null);
  const rightCardRef = useRef<HTMLAnchorElement | null>(null);
  const textWrapRef = useRef<HTMLDivElement | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const hasPlayedRef = useRef(false);
  const hasLockedRef = useRef(false);

  // Viewport locking: same as Core capabilities — align when section enters, then pin briefly
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

  useEffect(() => {
    const section = sectionRef.current;
    const centerCard = centerCardRef.current;
    const leftCard = leftCardRef.current;
    const rightCard = rightCardRef.current;
    const textWrap = textWrapRef.current;
    if (!section || !centerCard || !textWrap) return;

    const isMobile = typeof window !== "undefined" && window.innerWidth < MD_BREAKPOINT;

    if (leftCard && rightCard && !isMobile) {
      gsap.set([leftCard, rightCard], {
        x: 0,
        y: 0,
        rotation: 0,
        scale: 1,
      });
    }
    gsap.set(centerCard, { autoAlpha: 0, y: 20, scale: 0.96 });
    gsap.set(textWrap, { autoAlpha: 0, y: 24, filter: "blur(12px)" });

    const tl = gsap.timeline({ paused: true });

    if (leftCard && rightCard && !isMobile) {
      tl.to(leftCard, {
        keyframes: [
          { y: CARD_ARC_Y, duration: 0.22, ease: "power2.out" },
          {
            y: 0,
            x: -CARD_OFFSET_X,
            rotation: LEFT_ROTATION,
            duration: 0.6,
            ease: "power2.inOut",
          },
        ],
      }, 0);

      tl.to(rightCard, {
        keyframes: [
          { y: CARD_ARC_Y, duration: 0.22, ease: "power2.out" },
          {
            y: 0,
            x: CARD_OFFSET_X,
            rotation: RIGHT_ROTATION,
            duration: 0.6,
            ease: "power2.inOut",
          },
        ],
      }, 0);
    }

    tl.to(centerCard, {
      autoAlpha: 1,
      y: 0,
      scale: 1,
      duration: 0.55,
      ease: "power2.out",
    }, isMobile ? 0 : 0.15);

    tl.to(
      textWrap,
      {
        autoAlpha: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.6,
        ease: "power2.out",
      },
      isMobile ? 0.2 : 0.35
    );

    tlRef.current = tl;

    let delayId: ReturnType<typeof setTimeout> | null = null;

    const io = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry || !tlRef.current) return;
        if (hasPlayedRef.current) return;
        const inView = entry.isIntersecting && entry.intersectionRatio >= 0.15;

        if (inView) {
          delayId = setTimeout(() => {
            delayId = null;
            if (hasPlayedRef.current) return;
            hasPlayedRef.current = true;
            tlRef.current?.play();
          }, VIEWPORT_DELAY * 1000);
        } else {
          if (delayId) {
            clearTimeout(delayId);
            delayId = null;
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px" }
    );

    io.observe(section);

    return () => {
      io.disconnect();
      if (delayId) clearTimeout(delayId);
      tlRef.current?.kill();
      tlRef.current = null;
    };
  }, []);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative z-20 min-h-screen w-full bg-section-bg flex flex-col items-center justify-center py-12 px-4 sm:py-16 sm:px-6 md:py-20 lg:py-24 lg:px-8 overflow-hidden"
    >
      {/* Arc: hidden on mobile, shown from md */}
      <div
        className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-screen h-[320px] pointer-events-none"
        style={{ width: "100vw" }}
        aria-hidden
      >
        <svg className="w-full h-full" viewBox="0 0 1200 320" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" aria-hidden>
          <path d="M 0 220 Q 600 40 1200 220" stroke="var(--featured-arc-stroke)" strokeWidth="2" fill="none" />
        </svg>
      </div>

      {/* Cards container — single card on mobile, three on desktop */}
      <div className="relative flex items-center justify-center w-full max-w-6xl h-[300px] sm:h-[340px] md:h-[420px] lg:h-[480px]">
        <a
          ref={centerCardRef}
          href="https://lifestoryapp.com"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute z-10 w-[260px] h-[300px] sm:w-[300px] sm:h-[340px] md:w-[360px] md:h-[440px] rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border border-border-subtle bg-foreground/5 block"
          aria-label="Lifestory — open site"
        >
          <img
            src="/featured/featured-1.png"
            alt="Lifestory app"
            className="w-full h-full object-cover"
          />
        </a>

        <a
          ref={leftCardRef}
          href="https://buckyy.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:block absolute z-0 w-[280px] h-[360px] lg:w-[320px] lg:h-[400px] rounded-2xl overflow-hidden shadow-xl border border-border-subtle bg-foreground/5"
          style={{ transformOrigin: "center center" }}
          aria-label="Buckyy — open site"
        >
          <img src="/featured/featured-2.png" alt="" className="w-full h-full object-cover" />
        </a>

        <a
          ref={rightCardRef}
          href="https://buckyy.com/rini"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:block absolute z-0 w-[280px] h-[360px] lg:w-[320px] lg:h-[400px] rounded-2xl overflow-hidden shadow-xl border border-border-subtle bg-foreground/5"
          style={{ transformOrigin: "center center" }}
          aria-label="Rini — open site"
        >
          <img src="/featured/featured-3.png" alt="" className="w-full h-full object-cover" />
        </a>
      </div>

      <div ref={textWrapRef} className="relative z-20 mt-6 sm:mt-8 md:mt-12 text-center max-w-xl mx-auto px-2">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
          Featured Work
        </h2>
        <p className={`mt-2 sm:mt-3 text-text-muted text-sm sm:text-base md:text-lg leading-relaxed ${dmMono.className}`}>
          Selected app and product builds — from fintech and AI platforms to clean, scalable mobile and web experiences.
        </p>
      </div>
    </section>
  );
}
