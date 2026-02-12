"use client";

import { forwardRef, useEffect, useRef } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

const TITLES = [
  "Software Engineer",
  "Full Stack Developer",
  "Frontend Engineer",
  "Product Engineer",
  "UI Engineer",
];

const AnimatedTitle = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(function AnimatedTitle({ className, ...props }, ref) {
  const containerRef = useRef<HTMLSpanElement | null>(null);
  const indexRef = useRef(0);
  const delayRef = useRef<ReturnType<typeof gsap.delayedCall> | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const runCycle = () => {
      const title = TITLES[indexRef.current];
      indexRef.current = (indexRef.current + 1) % TITLES.length;

      container.innerHTML = "";
      const letters = title.split("").map((char) => {
        const span = document.createElement("span");
        span.textContent = char === " " ? "\u00A0" : char;
        span.className = "inline-block";
        span.style.opacity = "0";
        span.style.filter = "blur(8px)";
        if (char === " ") span.style.minWidth = "0.25em";
        container.appendChild(span);
        return span;
      });

      const tl = gsap.timeline({
        onComplete: () => {
          delayRef.current = gsap.delayedCall(1.5, runCycle);
        },
      });

      // Fade in from left (first letter first)
      tl.to(letters, {
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.12,
        stagger: { each: 0.03, from: "start" },
        ease: "power2.out",
      });

      // Fade out from right (last letter first)
      tl.to(letters, {
        opacity: 0,
        filter: "blur(8px)",
        duration: 0.12,
        stagger: { each: 0.03, from: "end" },
        ease: "power2.in",
        delay: 2,
      });
    };

    runCycle();

    return () => {
      delayRef.current?.kill();
    };
  }, []);

  return (
    <p ref={ref} className={cn("min-h-[1.5em]", className)} {...props}>
      <span ref={containerRef} className="inline-block" aria-live="polite" />
    </p>
  );
});

export default AnimatedTitle;
