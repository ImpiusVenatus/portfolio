"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import ContactForm from "@/components/ContactForm";
import TransitionLink from "@/components/TransitionLink";
import { dmMono } from "@/app/layout";

const EMAIL = "hossainsadman39@gmail.com";
const ENTRY_DELAY_MS = 120;
const ENTRY_DURATION = 0.55;
const ENTRY_STAGGER = 0.12;

export default function ContactPageContent() {
  const leftRef = useRef<HTMLDivElement | null>(null);
  const formWrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const leftEl = leftRef.current;
    const formWrap = formWrapRef.current;
    if (!leftEl || !formWrap) return;

    gsap.set([leftEl, formWrap], { autoAlpha: 0, y: 20 });

    const tl = gsap.timeline({ delay: ENTRY_DELAY_MS / 1000 });
    tl.to(leftEl, {
      autoAlpha: 1,
      y: 0,
      duration: ENTRY_DURATION,
      ease: "power2.out",
    });
    tl.to(
      formWrap,
      {
        autoAlpha: 1,
        y: 0,
        duration: ENTRY_DURATION,
        ease: "power2.out",
      },
      ENTRY_STAGGER
    );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
      <div ref={leftRef} className="text-left order-2 lg:order-1">
        <div className={`text-[10px] tracking-[0.28em] text-white/45 ${dmMono.className}`}>
          CONTACT
        </div>
        <h1 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-bold text-[#F4F1D8] tracking-tight">
          Let&apos;s work together
        </h1>
        <p className="mt-8 text-white/70 text-lg md:text-xl leading-relaxed max-w-lg">
          Open to agency collaborations, freelance work, and fully remote full-time opportunities.
        </p>
        <a
          href={`mailto:${EMAIL}`}
          className={`group relative mt-10 inline-flex items-center justify-center gap-2 text-white/80 hover:text-white transition-colors duration-200 ${dmMono.className} tracking-widest text-xs`}
        >
          <span className="pointer-events-none absolute -left-4 top-1/2 -translate-y-1/2 opacity-0 -translate-x-1 transition-all duration-200 ease-out group-hover:opacity-100 group-hover:translate-x-0">
            <Image src="/icons/hero-bracket.svg" alt="" width={6} height={6} className="opacity-90" />
          </span>
          <span>GET IN TOUCH</span>
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
        <div className={`mt-12 flex flex-col sm:flex-row flex-wrap gap-6 ${dmMono.className} text-xs tracking-widest text-white/60`}>
          <a href={`mailto:${EMAIL}`} className="text-white/70 hover:text-white transition-colors uppercase">
            {EMAIL}
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            INSTAGRAM
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
            LINKEDIN
          </a>
        </div>
        <TransitionLink
          href="/"
          className={`mt-10 inline-flex items-center gap-2 text-white/50 hover:text-white/80 transition-colors ${dmMono.className} text-xs tracking-widest`}
        >
          ← Back to home
        </TransitionLink>
      </div>

      <div ref={formWrapRef} className="order-1 lg:order-2">
        <ContactForm />
      </div>
    </div>
  );
}
