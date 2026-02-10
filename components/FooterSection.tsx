"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { dmMono, raderFont } from "@/app/layout";

gsap.registerPlugin(ScrollTrigger);

const EMAIL = "hossainsadman39@gmail.com";
const BST_TIMEZONE = "Asia/Dhaka";

const NAME_LETTERS = ["S", "A", "D", "M", "A", "N", "H", "O", "S", "S", "A", "I", "N"] as const;

/** Scramble text like mobile nav menu (random chars -> final text) */
function scrambleTo(el: HTMLElement, finalText: string, duration = 0.55) {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@$#%&*+-";
  const obj = { t: 0 };
  const len = finalText.length;
  return gsap.to(obj, {
    t: 1,
    duration,
    ease: "power2.out",
    onUpdate: () => {
      const reveal = Math.floor(obj.t * len);
      let out = "";
      for (let i = 0; i < len; i++) {
        out += i < reveal ? finalText[i] : charset[Math.floor(Math.random() * charset.length)];
      }
      el.textContent = out;
    },
    onComplete: () => {
      el.textContent = finalText;
    },
  });
}

/** Fisher–Yates shuffle */
function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function useBSTClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const format = () => {
      const s = new Date().toLocaleTimeString("en-GB", {
        timeZone: BST_TIMEZONE,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
      setTime(`BST - ${s}`);
    };
    format();
    const id = setInterval(format, 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function FooterSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const ctaTextRef = useRef<HTMLParagraphElement | null>(null);
  const ctaButtonRef = useRef<HTMLAnchorElement | null>(null);
  const footerRef = useRef<HTMLDivElement | null>(null);
  const emailRef = useRef<HTMLAnchorElement | null>(null);
  const instagramRef = useRef<HTMLAnchorElement | null>(null);
  const linkedinRef = useRef<HTMLAnchorElement | null>(null);
  const backToTopRef = useRef<HTMLButtonElement | null>(null);
  const nameWrapRef = useRef<HTMLDivElement | null>(null);
  const letterRefs = useRef<(HTMLDivElement | null)[]>([]);
  const hasAnimatedRef = useRef(false);
  const hasExitedRef = useRef(false);
  const bstTime = useBSTClock();

  const tiltedIndices = useMemo(
    () => shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]).slice(0, 6),
    []
  );

  useEffect(() => {
    const section = sectionRef.current;
    const ctaText = ctaTextRef.current;
    const ctaButton = ctaButtonRef.current;
    const footer = footerRef.current;
    const emailEl = emailRef.current;
    const instagramEl = instagramRef.current;
    const linkedinEl = linkedinRef.current;
    const backToTop = backToTopRef.current;
    const nameWrap = nameWrapRef.current;
    if (!section || !ctaText || !ctaButton || !footer || !nameWrap) return;

    gsap.set([ctaText, ctaButton, footer, backToTop], { autoAlpha: 0, y: 20, filter: "blur(10px)" });
    if (emailEl) emailEl.textContent = "";
    if (instagramEl) instagramEl.textContent = "";
    if (linkedinEl) linkedinEl.textContent = "";

    const runEntry = () => {
      if (hasAnimatedRef.current) return;
      hasAnimatedRef.current = true;
      hasExitedRef.current = false;

      const tl = gsap.timeline();

      tl.to(ctaText, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.6, ease: "power2.out" }, 0);
      tl.to(ctaButton, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.55, ease: "power2.out" }, 0.15);
      tl.to(footer, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.5, ease: "power2.out" }, 0.25);

      const SCRAMBLE_DUR = 0.7;
      const tScramble = 0.4;
      if (emailEl) tl.add(() => { scrambleTo(emailEl, EMAIL, SCRAMBLE_DUR); }, tScramble);
      if (instagramEl) tl.add(() => { scrambleTo(instagramEl, "INSTAGRAM", SCRAMBLE_DUR); }, tScramble + 0.12);
      if (linkedinEl) tl.add(() => { scrambleTo(linkedinEl, "LINKEDIN", SCRAMBLE_DUR); }, tScramble + 0.24);

      tl.to(backToTop, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.4, ease: "power2.out" }, 0.5);

      const letters = letterRefs.current.filter(Boolean) as HTMLElement[];
      if (letters.length === 13) {
        gsap.set(letters, { autoAlpha: 0 });
        const tiltDeg = 18;
        tiltedIndices.forEach((i) => gsap.set(letters[i], { rotation: Math.random() > 0.5 ? tiltDeg : -tiltDeg }));
        const letterStagger = 0.14;
        const letterStart = 0.6;
        letters.forEach((el, i) => {
          tl.to(el, { autoAlpha: 1, duration: 0.4, ease: "power2.out" }, letterStart + i * letterStagger);
        });
        const untiltOrder = shuffle([...tiltedIndices]);
        const untiltStart = letterStart + 13 * letterStagger + 0.4;
        untiltOrder.forEach((idx, i) => {
          tl.to(letters[idx], { rotation: 0, duration: 0.65, ease: "back.out(1.4)" }, untiltStart + i * 0.12);
        });
      }
    };

    const runExit = () => {
      if (hasExitedRef.current) return;
      hasExitedRef.current = true;
      gsap.to([ctaText, ctaButton, footer, backToTop], {
        autoAlpha: 0,
        y: -20,
        filter: "blur(10px)",
        duration: 0.45,
        stagger: 0.05,
        ease: "power2.in",
      });
      const lettersExit = letterRefs.current.filter(Boolean) as HTMLElement[];
      if (lettersExit.length) gsap.to(lettersExit, { autoAlpha: 0, duration: 0.3, stagger: 0.02, ease: "power2.in" });
      hasAnimatedRef.current = false;
    };

    const io = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry) return;
        if (entry.isIntersecting && entry.intersectionRatio >= 0.2) runEntry();
      },
      { threshold: [0.2, 0.5], rootMargin: "0px" }
    );
    io.observe(section);

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top bottom",
      end: "top top",
      onLeaveBack: runExit,
    });

    return () => {
      io.disconnect();
      st.kill();
    };
  }, [tiltedIndices]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      id="contact"
      ref={sectionRef}
      className="relative z-20 w-full h-screen flex flex-col bg-section-bg pt-24 pb-12 px-10 md:px-14"
    >
      <div className="max-w-7xl mx-auto w-full flex flex-col flex-1 min-h-0">
        {/* Top: CTA + button left; email, socials, time, back to top right */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 lg:gap-12 items-start">
          <div>
            <p
              ref={ctaTextRef}
              className="text-foreground/90 text-xl md:text-2xl lg:text-3xl leading-relaxed max-w-2xl"
            >
              Let&apos;s build and ship something remarkable. Open to agency collaborations, freelance work, and fully remote full-time opportunities.
            </p>
            <a
              ref={ctaButtonRef}
              href={`mailto:${EMAIL}`}
              className={`group relative ml-4 mt-10 w-fit inline-flex items-center justify-center gap-2 text-text-muted hover:text-foreground transition-colors duration-200 ${dmMono.className} tracking-widest text-xs`}
            >
              <span className="pointer-events-none absolute -left-4 top-1/2 -translate-y-1/2 opacity-0 -translate-x-1 transition-all duration-200 ease-out group-hover:opacity-100 group-hover:translate-x-0">
                <Image
                  src="/icons/hero-bracket.svg"
                  alt=""
                  width={6}
                  height={6}
                  className="opacity-90 invert dark:invert-0"
                />
              </span>
              <span>LET&apos;S WORK TOGETHER</span>
              <span className="inline-block text-text-muted-2 transition-transform duration-300 ease-out group-hover:rotate-[360deg] group-hover:scale-110">
                ↗
              </span>
              <span className="pointer-events-none absolute -right-4 top-1/2 -translate-y-1/2 opacity-0 translate-x-1 transition-all duration-200 ease-out group-hover:opacity-100 group-hover:translate-x-0">
                <Image
                  src="/icons/hero-bracket.svg"
                  alt=""
                  width={6}
                  height={6}
                  className="opacity-90 rotate-180 invert dark:invert-0"
                />
              </span>
            </a>
          </div>
          <div
            ref={footerRef}
            className={`flex flex-col gap-4 ${dmMono.className} text-xs tracking-widest text-text-muted-2 lg:text-right`}
          >
            <a ref={emailRef} href={`mailto:${EMAIL}`} className="text-text-muted hover:text-foreground transition-colors uppercase">
              {EMAIL}
            </a>
            <div className="flex flex-col gap-2 lg:items-end">
              <a ref={instagramRef} href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                INSTAGRAM
              </a>
              <a ref={linkedinRef} href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                LINKEDIN
              </a>
            </div>
            <div className="text-text-muted tabular-nums">{bstTime}</div>
          </div>
        </div>

        {/* Name: 3 full-width horizontal lines + 2 vertical lines. Text in container, HOSSAIN right-aligned. */}
        <div ref={nameWrapRef} className="relative mt-10 pt-4 overflow-visible flex-1 flex flex-col justify-center">
          <div className="h-px bg-foreground/15 w-screen relative left-1/2 -translate-x-1/2" aria-hidden />
          <div className="relative w-full min-w-0 overflow-visible">
            <div
              className={`flex flex-wrap items-center justify-start gap-1 md:gap-2 lg:gap-3 min-w-0 text-foreground/90 ${raderFont.className}`}
              style={{ fontSize: "clamp(4rem, 14vw, 11rem)", letterSpacing: "0.0em" }}
            >
              {NAME_LETTERS.slice(0, 6).map((char, i) => (
                <div key={`s-${i}`} ref={(el) => { letterRefs.current[i] = el; }} className="inline-block opacity-0" data-letter={char}>{char}</div>
              ))}
            </div>
            <div className="h-px bg-foreground/15 w-screen relative left-1/2 -translate-x-1/2" aria-hidden />
            <div
              className={`flex flex-wrap items-center justify-end gap-1 md:gap-2 lg:gap-3 min-w-0 text-foreground/90 ${raderFont.className}`}
              style={{ fontSize: "clamp(4rem, 14vw, 11rem)", letterSpacing: "0.0em" }}
            >
              {NAME_LETTERS.slice(6, 13).map((char, i) => (
                <div key={`h-${i}`} ref={(el) => { letterRefs.current[6 + i] = el; }} className="inline-block opacity-0" data-letter={char}>{char}</div>
              ))}
            </div>
            <div className="absolute left-0 -top-3 -bottom-3 w-px bg-foreground/15" aria-hidden />
            <div className="absolute right-0 -top-3 -bottom-3 w-px bg-foreground/15" aria-hidden />
          </div>
          <div className="h-px bg-foreground/15 w-screen relative left-1/2 -translate-x-1/2" aria-hidden />
        </div>

        {/* Back to top: bottom right, arrow button with growing/fading pulse bg */}
        <div className="absolute right-18 bottom-18 mt-auto pt-6 flex justify-end">
          <button
            ref={backToTopRef}
            type="button"
            onClick={scrollToTop}
            className="relative cursor-pointer flex items-center justify-center w-12 h-12 rounded-full bg-foreground/10 border border-foreground/30 text-text-muted hover:text-foreground hover:border-foreground/50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-foreground/40 overflow-visible"
            aria-label="Back to top"
          >
            <span className="absolute inset-0 rounded-full bg-foreground/20 pointer-events-none animate-back-to-top-pulse" aria-hidden />
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="relative z-10 shrink-0">
              <path d="M18 15l-6-6-6 6" />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
}
