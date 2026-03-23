 "use client";

import Image from "next/image";
 import React, { useLayoutEffect, useRef } from "react";
 import gsap from "gsap";
import { dmMono, spaceGrotesk } from "@/app/fonts";
import TransitionLink from "@/components/TransitionLink";

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
        <div className="w-full py-12 sm:py-16 md:py-20">
          <div className="w-full flex justify-center">
            <div className="w-full max-w-md">
               <TransitionLink
                 href="/tomfoolery/appscan"
                 className="group block relative rounded-3xl border border-border-subtle/80 bg-section-bg/40 px-5 py-6 sm:px-6 sm:py-7 shadow-sm overflow-hidden"
                 aria-label="Open Appscan project"
               >
                 <div
                   className={`text-[10px] tracking-[0.24em] text-text-muted-2 uppercase mb-3 ${dmMono.className}`}
                 >
                   APPSCAN
                 </div>

                 <div className="relative w-full h-44 sm:h-48 rounded-2xl overflow-hidden border border-border-subtle/70 bg-background">
                   <Image
                     src="/tomfoolery/appscan/img01.png"
                     alt="Appscan preview"
                     fill
                     className="object-cover transition-opacity duration-500 group-hover:opacity-0"
                     sizes="(max-width: 768px) 90vw, 45vw"
                   />
                   <Image
                     src="/tomfoolery/appscan/img02.png"
                     alt=""
                     fill
                     className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                     sizes="(max-width: 768px) 90vw, 45vw"
                   />
                 </div>

                 <p className="mt-5 text-sm sm:text-base text-heading font-medium leading-relaxed">
                   Upload an APK, get analysis & insights.
                 </p>
                 <p className="mt-2 text-[11px] sm:text-xs text-text-muted-2 leading-relaxed">
                   Permissions, suspicious signals, and structured reports — so you can move fast with confidence.
                 </p>

                 <span className="mt-4 inline-flex items-center gap-2 text-text-muted-2 group-hover:text-foreground transition-colors duration-200 text-xs tracking-widest uppercase">
                   Open →
                 </span>
               </TransitionLink>
             </div>
           </div>
         </div>
       </section>
     </>
   );
 }

