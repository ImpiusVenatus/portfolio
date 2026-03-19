 "use client";

import Image from "next/image";
 import gsap from "gsap";
 import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import { dmMono, spaceGrotesk } from "@/app/layout";

export default function AppscanProjectPage() {
  const [modalSrc, setModalSrc] = useState<null | string>(null);
  const closingRef = useRef(false);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const [fitMode, setFitMode] = useState<"cover" | "contain">("cover");
  const zoomTitle = useMemo(() => {
    if (modalSrc?.includes("img01")) return "APK Insight";
    if (modalSrc?.includes("img02")) return "Analysis Report";
    return "Preview";
  }, [modalSrc]);

  useEffect(() => {
    if (!modalSrc) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") requestClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalSrc]);

  const openZoom = (src: string) => {
    closingRef.current = false;
    setFitMode("cover"); // no letterboxing by default
    setModalSrc(src);
  };

  const requestClose = () => {
    if (!modalSrc) return;
    if (closingRef.current) return;
    closingRef.current = true;

    const overlayEl = overlayRef.current;
    const modalEl = modalRef.current;

    // Animate out, then unmount.
    if (overlayEl && modalEl) {
      gsap.killTweensOf([overlayEl, modalEl]);
      gsap.to(overlayEl, {
        opacity: 0,
        duration: 0.18,
        ease: "power2.out",
      });
      gsap.to(modalEl, {
        opacity: 0,
        y: 10,
        scale: 0.98,
        duration: 0.18,
        ease: "power2.out",
        onComplete: () => {
          closingRef.current = false;
          setModalSrc(null);
          setFitMode("cover");
        },
      });
      return;
    }

    closingRef.current = false;
    setModalSrc(null);
    setFitMode("cover");
  };

  useLayoutEffect(() => {
    if (!modalSrc) return;
    closingRef.current = false;

    const overlayEl = overlayRef.current;
    const modalEl = modalRef.current;
    if (!overlayEl || !modalEl) return;

    gsap.killTweensOf([overlayEl, modalEl]);
    gsap.set(overlayEl, { opacity: 0 });
    gsap.set(modalEl, { opacity: 0, y: 14, scale: 0.98 });

    gsap.to(overlayEl, { opacity: 1, duration: 0.22, ease: "power2.out" });
    gsap.to(modalEl, { opacity: 1, y: 0, scale: 1, duration: 0.32, ease: "power3.out" });
  }, [modalSrc]);

  const toggleFullScreen = () => {
    setFitMode("contain"); // show the full image

    // Request fullscreen on the modal wrapper (best-effort).
    const el = document.getElementById("appscan-zoom-modal");
    if (el && el.requestFullscreen) {
      el.requestFullscreen().catch(() => {});
    }
  };

  return (
    <main className="min-h-screen bg-page-bg">
      <Navbar />

      <section className="relative z-20 min-h-screen w-full flex flex-col items-center pt-28 pb-12 px-6 sm:px-10 md:px-14 bg-section-bg">
        <div className="w-full max-w-6xl">
          <div className="flex flex-col md:flex-row gap-10 md:gap-14 items-start">
            <div className="flex-1">
              <div className={`text-[10px] tracking-[0.28em] text-text-muted uppercase ${dmMono.className}`}>
                TOMFOOLERY / PROJECT
              </div>
              <h1 className={`${spaceGrotesk.className} uppercase font-bold text-heading tracking-tight mt-4`} style={{ fontSize: "clamp(2.8rem, 7vw, 4.2rem)", lineHeight: 0.9 }}>
                Appscan
              </h1>
              <p className="mt-6 max-w-2xl text-text-muted text-sm sm:text-base md:text-lg leading-relaxed">
                Appscan is an APK analysis playground: upload an APK and get a structured report with highlights.
              </p>

                <a
                  href="https://appscan.lovable.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-6 inline-flex items-center justify-center gap-2 rounded-full border border-border-subtle/70 bg-section-bg/30 px-5 py-3 text-text-muted hover:text-foreground transition-colors duration-200 text-xs tracking-widest uppercase ${dmMono.className}`}
                >
                  Open Appscan ↗
                </a>

              <div className="mt-8 space-y-4">
                <div className={`text-[10px] tracking-[0.24em] text-text-muted-2 uppercase ${dmMono.className}`}>
                  What you&apos;ll find
                </div>
                <ul className="space-y-2 text-foreground/70 text-sm sm:text-base">
                  <li>File Info + APK metadata (size, package name, SDK/build signals)</li>
                  <li>App Metadata (app + build details)</li>
                  <li>Device & Performance Insights (quick triage metrics)</li>
                  <li>Framework Detection (Flutter / React Native / etc.)</li>
                  <li>Third-Party SDKs (libraries detected in the app)</li>
                  <li>Permissions breakdown (grouped + highlighted)</li>
                  <li>Assets Preview (icons/screenshots and resource overview)</li>
                </ul>
              </div>
            </div>

            <div className="flex-1 w-full">
              <div className="relative rounded-3xl overflow-hidden border border-border-subtle bg-background shadow-sm">
                <div className="relative w-full h-[260px] sm:h-[320px] md:h-[380px]">
                  <Image
                    src="/tomfoolery/appscan/img01.png"
                    alt="Appscan screenshot"
                    fill
                    className="object-cover cursor-zoom-in"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                    onClick={() => openZoom("/tomfoolery/appscan/img01.png")}
                  />
                </div>
              </div>

              <div className="relative mt-4 rounded-2xl overflow-hidden border border-border-subtle/70 bg-background">
                <div className="relative w-full h-[260px] sm:h-[300px] md:h-[340px]">
                  <Image
                    src="/tomfoolery/appscan/img02.png"
                    alt=""
                    fill
                    className="object-cover cursor-zoom-in"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    onClick={() => openZoom("/tomfoolery/appscan/img02.png")}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Click-to-zoom modal */}
      {modalSrc && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-[99999] bg-black/70 backdrop-blur-[2px] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`${zoomTitle} zoom`}
          onMouseDown={(e) => {
            if (e.currentTarget === e.target) requestClose();
          }}
        >
          <div
            ref={modalRef}
            id="appscan-zoom-modal"
            className="relative w-full max-w-4xl h-[85vh] rounded-3xl overflow-hidden border border-white/10 bg-background"
          >
            <div className="absolute left-4 top-4 z-10">
              <button
                type="button"
                onClick={toggleFullScreen}
                className="px-3 py-2 text-xs tracking-widest uppercase rounded-full border border-white/15 bg-black/20 text-white/90 hover:text-white transition-colors"
              >
                Full image
              </button>
            </div>
            <Image
              src={modalSrc}
              alt={zoomTitle}
              fill
              className={fitMode === "contain" ? "object-contain" : "object-cover"}
              sizes="(max-width: 768px) 100vw, 80vw"
              priority
            />
          </div>
        </div>
      )}

      <FooterSection />
    </main>
  );
}

