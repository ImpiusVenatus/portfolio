"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { dmMono } from "@/app/layout";

const VIEWPORT_DELAY = 0.2;

// Bigger cards: center ~320x400, side ~280x350, offset so arc is visible
const CARD_OFFSET_X = 280;
const CARD_ARC_Y = -48;
const LEFT_ROTATION = -14;
const RIGHT_ROTATION = 14;

export default function FeaturedWorkSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const centerCardRef = useRef<HTMLDivElement | null>(null);
  const leftCardRef = useRef<HTMLDivElement | null>(null);
  const rightCardRef = useRef<HTMLDivElement | null>(null);
  const textWrapRef = useRef<HTMLDivElement | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

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
        const inView = entry.isIntersecting && entry.intersectionRatio >= 0.12;

        if (inView) {
          delayId = setTimeout(() => {
            delayId = null;
            tlRef.current?.play();
          }, VIEWPORT_DELAY * 1000);
        } else {
          if (delayId) {
            clearTimeout(delayId);
            delayId = null;
          }
          tlRef.current?.reverse();
        }
      },
      { threshold: [0, 0.05, 0.12, 0.25, 0.5, 1], rootMargin: "0px" }
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
      {/* Same bg as Services / Text sections */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-white/5" />
        <div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -right-40 -bottom-40 h-[520px] w-[520px] rounded-full bg-white/10 blur-3xl" />
      </div>

      {/* Arc: curves from center card top to left/right card tops (drawn in final positions) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <svg
          className="absolute w-[900px] h-[420px]"
          viewBox="0 0 900 420"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          {/* Left arc: center (450, 100) → curve up and left → left card (170, 100) */}
          <path
            d="M 450 100 Q 280 20 170 100"
            stroke="rgba(255,255,255,0.18)"
            strokeWidth="1.5"
            fill="none"
          />
          {/* Right arc: center (450, 100) → curve up and right → right card (730, 100) */}
          <path
            d="M 450 100 Q 620 20 730 100"
            stroke="rgba(255,255,255,0.18)"
            strokeWidth="1.5"
            fill="none"
          />
        </svg>
      </div>

      {/* Cards container - bigger */}
      <div className="relative flex items-center justify-center w-full max-w-5xl h-[380px] md:h-[420px]">
        <div
          ref={centerCardRef}
          className="absolute z-10 w-[280px] h-[360px] md:w-[320px] md:h-[400px] rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-white/5"
        >
          <img
            src="https://images.unsplash.com/photo-1545127398-14699f92334b?w=640&q=80"
            alt="Featured app"
            className="w-full h-full object-cover"
          />
        </div>

        <div
          ref={leftCardRef}
          className="absolute z-0 w-[240px] h-[320px] md:w-[280px] md:h-[350px] rounded-2xl overflow-hidden shadow-xl border border-white/10 bg-white/5"
          style={{ transformOrigin: "center center" }}
        >
          <img
            src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=560&q=80"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>

        <div
          ref={rightCardRef}
          className="absolute z-0 w-[240px] h-[320px] md:w-[280px] md:h-[350px] rounded-2xl overflow-hidden shadow-xl border border-white/10 bg-white/5"
          style={{ transformOrigin: "center center" }}
        >
          <img
            src="https://images.unsplash.com/photo-1551650975-87deedd944c3?w=560&q=80"
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
