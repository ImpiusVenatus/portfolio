"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { dmMono, spaceGrotesk } from "@/app/layout";
import { Compare } from "./ui/compare";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);

  const uiRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);

  // Left-side process text refs
  const processTextRef = useRef<HTMLDivElement | null>(null);
  const fromRef = useRef<HTMLDivElement | null>(null);
  const toRef = useRef<HTMLDivElement | null>(null);
  const prodRef = useRef<HTMLDivElement | null>(null);

  // Right-side compare ref
  const compareWrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (
      !sectionRef.current ||
      !uiRef.current ||
      !cardRef.current ||
      !innerRef.current ||
      !processTextRef.current ||
      !fromRef.current ||
      !toRef.current ||
      !prodRef.current ||
      !compareWrapRef.current
    )
      return;

    let heroCompleteFired = false;
    const ctx = gsap.context(() => {
      const sectionEl = sectionRef.current!;
      const uiEl = uiRef.current!;
      const cardEl = cardRef.current!;
      const innerEl = innerRef.current!;
      const processEl = processTextRef.current!;
      const fromEl = fromRef.current!;
      const toEl = toRef.current!;
      const prodEl = prodRef.current!;
      const compareEl = compareWrapRef.current!;

      // Initial states
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

      // Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionEl,
          start: "top top",
          end: "+=340%", // ✅ extra scroll room to let image fly out + leave blank
          scrub: true,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,

          // ✅ Broadcast Hero progress so Navbar can swap reliably; fire hero:complete once when done so Services can auto-lock
          onUpdate: (self) => {
            window.dispatchEvent(
              new CustomEvent("hero:progress", {
                detail: { progress: self.progress },
              })
            );
            if (!heroCompleteFired && self.progress >= 0.98) {
              heroCompleteFired = true;
              window.dispatchEvent(new CustomEvent("hero:complete"));
            }
          },
        },
      });

      // UI travels up + fades
      tl.to(
        uiEl,
        {
          y: -380,
          autoAlpha: 0,
          ease: "none",
        },
        0
      );

      // Card expands to fullscreen
      tl.to(
        cardEl,
        {
          position: "fixed",
          left: 0,
          top: 0,
          x: 0,
          y: 0,
          transform: "none",
          width: "100vw",
          height: "100vh",
          borderRadius: 0,
          paddingLeft: 100,
          paddingRight: 100,
          paddingTop: 60,
          paddingBottom: 60,
          borderWidth: 0,
          boxShadow: "none",
          overflow: "hidden",
          ease: "none",
        },
        0
      );

      // subtle zoom
      tl.to(
        innerEl,
        {
          scale: 1.08,
          ease: "none",
        },
        0
      );

      // Show overlay container after fullscreen starts
      tl.to(processEl, { autoAlpha: 1, ease: "none" }, 0.6);

      // "From Idea"
      tl.to(
        fromEl,
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          ease: "power2.out",
          duration: 0.35,
        },
        0.68
      );

      // "to"
      tl.to(
        toEl,
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          ease: "power2.out",
          duration: 0.25,
        },
        0.82
      );

      // "Production"
      tl.to(
        prodEl,
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          ease: "power2.out",
          duration: 0.35,
        },
        0.92
      );

      // Compare appears AFTER Production
      tl.to(
        compareEl,
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          ease: "power2.out",
          duration: 0.45,
        },
        1.08
      );

      // -------------------------
      // ✅ EXIT PHASE (parallax: contents fade, image shrinks as next section comes up)
      // -------------------------

      // Hide overlay text + compare (delayed so compare stays on screen longer)
      tl.to(
        [fromEl, toEl, prodEl, compareEl],
        {
          autoAlpha: 0,
          filter: "blur(10px)",
          ease: "none",
          duration: 0.25,
        },
        1.72
      );

      // Ensure overlay container also goes away
      tl.to(
        processEl,
        {
          autoAlpha: 0,
          ease: "none",
          duration: 0.15,
        },
        1.76
      );

      // Shrink the fullscreen card in place (parallax) as next section scrolls up — no move up
      tl.to(
        cardEl,
        {
          scale: 0.88,
          transformOrigin: "50% 50%",
          ease: "none",
          duration: 0.6,
        },
        1.78
      );

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="hero" ref={sectionRef} className="relative h-screen bg-[#101318]">
      <div className="relative h-screen overflow-hidden px-14 pt-10 pb-16">
        {/* UI LAYER */}
        <div ref={uiRef} className="relative h-full flex flex-col z-30">
          {/* Center badge */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="flex items-center gap-6 opacity-90">
              <Image
                src="/icons/hero-bracket.svg"
                alt=""
                width={50}
                height={80}
                className="opacity-90"
                priority
              />

              <div className="text-center">
                <p className={`text-[11px] tracking-[0.25em] mb-3 ${dmMono.className}`}>
                  HELLO!
                </p>
                <p className="text-sm text-white/70 leading-relaxed font-medium">
                  I am Md Sadman Hossain <br />
                  alias ImpiusVenatus — <br />
                  web developer & engineer.
                </p>
              </div>

              <Image
                src="/icons/hero-bracket.svg"
                alt=""
                width={50}
                height={80}
                className="rotate-180 opacity-90"
                priority
              />
            </div>
          </div>

          {/* Bottom words */}
          <div className="mt-auto">
            <div className="flex items-end justify-between">
              <h1
                className={`${spaceGrotesk.className} font-bold text-[200px] leading-[0.82] text-[#F4F1D8] drop-shadow-xl`}
              >
                Creative
              </h1>
              <h1
                className={`${spaceGrotesk.className} font-bold text-[200px] leading-[0.82] text-[#F4F1D8] drop-shadow-xl`}
              >
                dev
              </h1>
            </div>
          </div>
        </div>

        {/* IMAGE */}
        <div
          ref={cardRef}
          className="absolute z-40 left-[60%] bottom-[50px] -translate-x-1/2 w-[320px] h-[220px]"
        >
          <div
            ref={innerRef}
            className="relative w-full h-full rounded-xl overflow-hidden will-change-transform border border-white/10"
          >
            <Image
              src="/hero-card.png"
              alt="Desk"
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40 pointer-events-none" />
          </div>
        </div>

        {/* LEFT TEXT + RIGHT COMPARE */}
        <div ref={processTextRef} className="fixed inset-0 z-[200] pointer-events-none">
          <div className="absolute left-24 top-1/2 -translate-y-1/2">
            <div className={`${spaceGrotesk.className} text-[#F4F1D8] tracking-tight`}>
              <div ref={fromRef} className="text-[160px] leading-none font-bold">
                From Idea
              </div>
              <div ref={toRef} className="text-[64px] leading-none mt-4 text-white/70">
                to
              </div>
              <div ref={prodRef} className="text-[160px] leading-none font-bold mt-4">
                Production
              </div>
            </div>
          </div>

          <div
            ref={compareWrapRef}
            className="absolute right-24 top-1/2 -translate-y-1/2 p-4 border rounded-3xl dark:bg-neutral-900 bg-neutral-100 border-neutral-200 dark:border-neutral-800 pointer-events-auto"
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
      </div>
    </section>
  );
}
