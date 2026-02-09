"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { dmMono } from "@/app/layout";

gsap.registerPlugin(ScrollTrigger);

const VIEWPORT_DELAY = 0.2;

// Bigger cards, spread much more along the arc
const CARD_OFFSET_X = 420;
const CARD_ARC_Y = -56;
const LEFT_ROTATION = -14;
const RIGHT_ROTATION = 14;

export default function FeaturedWorkSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const centerCardRef = useRef<HTMLDivElement | null>(null);
  const leftCardRef = useRef<HTMLDivElement | null>(null);
  const rightCardRef = useRef<HTMLDivElement | null>(null);
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
    if (!section || !centerCard || !leftCard || !rightCard || !textWrap) return;

    gsap.set([leftCard, rightCard], {
      x: 0,
      y: 0,
      rotation: 0,
      scale: 1,
    });
    gsap.set(textWrap, { autoAlpha: 0, y: 24, filter: "blur(12px)" });

    const tl = gsap.timeline({ paused: true });

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

    tl.to(
      textWrap,
      {
        autoAlpha: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.6,
        ease: "power2.out",
      },
      0.35
    );

    tlRef.current = tl;

    let delayId: ReturnType<typeof setTimeout> | null = null;

    const io = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry || !tlRef.current) return;
        // Only run once per page load; no exit/reset
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
      className="relative z-20 min-h-screen w-full bg-[#101318] flex flex-col items-center justify-center py-24 px-8 overflow-hidden"
    >
      {/* Arc: full viewport width, left edge to right edge of screen */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-screen h-[320px] pointer-events-none flex items-center justify-center"
        style={{ width: "100vw" }}
        aria-hidden
      >
        <svg
          className="w-full h-full"
          viewBox="0 0 1200 320"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          aria-hidden
        >
          <path
            d="M 0 220 Q 600 40 1200 220"
            stroke="rgba(255,255,255,0.16)"
            strokeWidth="2"
            fill="none"
          />
        </svg>
      </div>

      {/* Cards container - bigger, spread more */}
      <div className="relative flex items-center justify-center w-full max-w-6xl h-[420px] md:h-[480px]">
        <div
          ref={centerCardRef}
          className="absolute z-10 w-[320px] h-[400px] md:w-[360px] md:h-[440px] rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-white/5"
        >
          <img
            src="https://images.unsplash.com/photo-1545127398-14699f92334b?w=720&q=80"
            alt="Featured app"
            className="w-full h-full object-cover"
          />
        </div>

        <div
          ref={leftCardRef}
          className="absolute z-0 w-[280px] h-[360px] md:w-[320px] md:h-[400px] rounded-2xl overflow-hidden shadow-xl border border-white/10 bg-white/5"
          style={{ transformOrigin: "center center" }}
        >
          <img
            src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=640&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>

        <div
          ref={rightCardRef}
          className="absolute z-0 w-[280px] h-[360px] md:w-[320px] md:h-[400px] rounded-2xl overflow-hidden shadow-xl border border-white/10 bg-white/5"
          style={{ transformOrigin: "center center" }}
        >
          <img
            src="https://images.unsplash.com/photo-1551650975-87deedd944c3?w=640&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div
        ref={textWrapRef}
        className="relative z-20 mt-12 text-center max-w-xl mx-auto"
      >
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-white">
          Featured Work
        </h2>
        <p
          className={`mt-3 text-white/70 text-base md:text-lg leading-relaxed ${dmMono.className}`}
        >
          Selected app and product builds — from fintech and AI platforms to
          clean, scalable mobile and web experiences.
        </p>
      </div>
    </section>
  );
}
