"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { manrope } from "@/app/layout";

const LINE_STAGGER = 0.22;
const VIEWPORT_DELAY = 0.4;

export default function TextSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const line1Ref = useRef<HTMLSpanElement | null>(null);
  const line2Ref = useRef<HTMLSpanElement | null>(null);
  const line3Ref = useRef<HTMLSpanElement | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const line1 = line1Ref.current;
    const line2 = line2Ref.current;
    const line3 = line3Ref.current;
    if (!section || !line1 || !line2 || !line3) return;

    const lines = [line1, line2, line3];
    gsap.set(lines, { autoAlpha: 0, y: 24 });

    const tl = gsap.timeline({ paused: true });
    lines.forEach((line, i) => {
      tl.to(line, {
        autoAlpha: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
      }, i * LINE_STAGGER);
    });
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
      id="about"
      ref={sectionRef}
      className="relative z-20 min-h-screen w-full bg-[#101318] flex items-center justify-center py-24 px-8"
    >
      <div className="max-w-5xl mx-auto text-left">
        <p className={`text-[32px] text-white leading-relaxed ${manrope.className}`}>
          <span ref={line1Ref} className="block">
            I blend design, product strategy, and engineering to build seamless digital experiences.
          </span>
          <span ref={line2Ref} className="block mt-4">
            Over the past few years, I&apos;ve developed full-stack fintech and AI-driven platforms — from remittance and migrant services to intelligent credit scoring systems.
          </span>
          <span ref={line3Ref} className="block mt-4">
            Today, I bring that builder mindset to startups and ambitious teams, turning complex ideas into polished, scalable products.
          </span>
        </p>
      </div>
    </section>
  );
}
