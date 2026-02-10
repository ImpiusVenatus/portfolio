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
    <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
      <div ref={leftRef} className="text-center lg:text-left order-1 lg:order-1">
        <div className={`text-[10px] tracking-[0.28em] text-text-muted-2 ${dmMono.className}`}>
          CONTACT
        </div>
        <h1 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-bold text-heading tracking-tight">
          Let&apos;s work together
        </h1>
        <p className="mt-8 text-text-muted text-lg md:text-xl leading-relaxed max-w-lg mx-auto lg:mx-0">
          Open to agency collaborations, freelance work, and fully remote full-time opportunities.
        </p>
        <div className={`mt-12 flex flex-col sm:flex-row flex-wrap gap-6 justify-center lg:justify-start ${dmMono.className} text-xs tracking-widest text-text-muted-2`}>
          <a href={`mailto:${EMAIL}`} className="text-text-muted hover:text-foreground transition-colors uppercase">
            {EMAIL}
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
            INSTAGRAM
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
            LINKEDIN
          </a>
        </div>
        <TransitionLink
          href="/"
          className={`mt-10 inline-flex items-center gap-2 text-text-muted-2 hover:text-foreground/80 transition-colors ${dmMono.className} text-xs tracking-widest`}
        >
          ← Back to home
        </TransitionLink>
      </div>

      <div ref={formWrapRef} className="order-2 lg:order-2 w-full max-w-lg mx-auto lg:mx-0">
        <ContactForm />
      </div>
    </div>
  );
}
