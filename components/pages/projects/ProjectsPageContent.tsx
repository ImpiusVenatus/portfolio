"use client";

import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { dmMono, spaceGrotesk } from "@/app/layout";
import ProjectsSection from "@/components/ProjectsSection";

export default function ProjectsPageContent() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  // Intro: same as Services — title and subtitle animate in on load (useLayoutEffect to reduce delay after nav transition)
  useLayoutEffect(() => {
    const title = titleRef.current;
    const subtitle = subtitleRef.current;
    if (!title || !subtitle) return;

    const letters = title.querySelectorAll(".letter");
    gsap.set([...letters, subtitle], { opacity: 0, y: 24 });
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.to(letters, { opacity: 1, y: 0, duration: 0.6, stagger: 0.04 });
    tl.to(subtitle, { opacity: 1, y: 0, duration: 0.5 }, "-=0.3");
  }, []);

  return (
    <>
      {/* Hero: same structure as Services page */}
      <section
        className="relative min-h-screen h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 md:px-8 lg:px-14 pt-[max(2.5rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))] bg-section-bg overflow-hidden"
      >
        <div className="relative z-10 w-full max-w-[95vw]">
          <p className={`text-[10px] sm:text-[11px] tracking-[0.28em] text-text-muted uppercase ${dmMono.className} mb-3 sm:mb-4`}>
            SELECTED PROJECTS
          </p>
          <h1
            ref={titleRef}
            className={`${spaceGrotesk.className} uppercase font-bold text-heading tracking-tight w-full overflow-hidden`}
            style={{ fontSize: "clamp(4rem, 25vmin, 35vmin)", lineHeight: 0.85, letterSpacing: "-0.02em" }}
          >
            {"Projects".split("").map((char, i) => (
              <span key={i} className="letter inline-block">
                {char}
              </span>
            ))}
          </h1>
          <p
            ref={subtitleRef}
            className="mt-6 sm:mt-8 m-auto max-w-xl text-text-muted text-sm sm:text-base md:text-lg leading-relaxed px-2"
          >
            Product work across fintech, AI & apps. Scroll to explore case studies with context, mockups, and breakdowns.
          </p>
        </div>
      </section>

      <div className="relative z-10 bg-page-bg">
        <ProjectsSection />
      </div>
    </>
  );
}
