 "use client";

 import React, { useLayoutEffect, useRef } from "react";
 import gsap from "gsap";
 import { dmMono, spaceGrotesk } from "@/app/layout";

 const TAGLINE = "SIDE QUESTS · ODDITIES · PLAYGROUND BUILDS";

 export default function TomfooleryPageContent() {
   const titleRef = useRef<HTMLHeadingElement | null>(null);
   const subtitleRef = useRef<HTMLParagraphElement | null>(null);

   useLayoutEffect(() => {
     const title = titleRef.current;
     const subtitle = subtitleRef.current;
     if (!title || !subtitle) return;

     const letters = title.querySelectorAll(".letter");
     gsap.set([...letters, subtitle], { opacity: 0, y: 24 });
     const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
     tl.to(letters, { opacity: 1, y: 0, duration: 0.6, stagger: 0.04 });
     tl.to(subtitle, { opacity: 1, y: 0, duration: 0.5 }, "-=0.25");
   }, []);

   return (
     <>
       <section
         className="relative min-h-screen h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 md:px-8 lg:px-14 pt-[max(2.5rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))] bg-section-bg overflow-hidden"
       >
         <div className="relative z-10 w-full max-w-[95vw] space-y-6">
           <p
             className={`text-[10px] sm:text-[11px] tracking-[0.28em] text-text-muted uppercase ${dmMono.className}`}
           >
             IMPIUS&apos; TOMFOOLERY
           </p>
           <h1
             ref={titleRef}
             className={`${spaceGrotesk.className} uppercase font-bold text-heading tracking-tight w-full overflow-hidden`}
             style={{ fontSize: "clamp(3.6rem, 20vmin, 30vmin)", lineHeight: 0.9, letterSpacing: "-0.03em" }}
           >
             {"Tomfoolery".split("").map((char, i) => (
               <span key={i} className="letter inline-block">
                 {char}
               </span>
             ))}
           </h1>
           <p
             ref={subtitleRef}
             className="m-auto max-w-xl text-text-muted text-sm sm:text-base md:text-lg leading-relaxed px-2"
           >
             A tiny corner of the internet for experiments, one-off toys, cursed prototypes, and late-night
             engineering bits that don&apos;t fit anywhere else.
           </p>
           <p
             className={`text-[10px] sm:text-[11px] tracking-[0.28em] text-text-muted-2 uppercase ${dmMono.className}`}
           >
             {TAGLINE}
           </p>
         </div>
       </section>

       <section className="relative z-10 w-full bg-page-bg border-t border-border-subtle">
         <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-10 py-12 sm:py-16 md:py-20 space-y-10">
           <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start">
             <div className="flex-1 space-y-4">
               <p className="text-text-muted text-sm sm:text-base leading-relaxed max-w-xl">
                 This page is for the fun stuff: visual toys, tiny tools, throwaway UIs, physics doodles, and experiments
                 that exist simply because they were satisfying to build.
               </p>
               <p className="text-text-muted-2 text-xs sm:text-[13px] leading-relaxed">
                 I&apos;ll add individual cards here later with links, gifs, and little writeups for each experiment —
                 from weird scroll interactions to small AI utilities and game-like prototypes.
               </p>
             </div>
             <div className="flex-1 max-w-md w-full">
               <div className="relative rounded-3xl border border-dashed border-border-subtle/70 bg-section-bg/40 px-5 py-6 sm:px-6 sm:py-7 shadow-sm">
                 <div
                   className={`text-[10px] tracking-[0.24em] text-text-muted-2 uppercase mb-3 ${dmMono.className}`}
                 >
                   COMING SOON
                 </div>
                 <p className="text-sm sm:text-base text-heading font-medium leading-relaxed">
                   Fun projects live here. Once I&apos;m done shipping client work, this is where I&apos;ll drop the
                   wild ideas that never made it into a brief.
                 </p>
                 <p className="mt-3 text-[11px] sm:text-xs text-text-muted-2 leading-relaxed">
                   We&apos;ll wire this up with a little showcase grid: playable interactions, quick-read summaries, and
                   links out to live demos and repos.
                 </p>
               </div>
             </div>
           </div>
         </div>
       </section>
     </>
   );
 }

