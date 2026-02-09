"use client";

import { useCallback, useLayoutEffect, useState } from "react";
import Preloader from "./Preloader";

export default function PreloaderGate({
  children,
}: {
  children: React.ReactNode;
}) {
  // Start false so server and client match (no preloader in initial HTML). Show preloader
  // only after client decides we need it — avoids stuck preloader on refresh / HMR.
  const [showPreloader, setShowPreloader] = useState(false);
  const [hasDecided, setHasDecided] = useState(false);

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    if (hasDecided) return;
    setHasDecided(true);
    if (sessionStorage.getItem("preloaderDone") || (window as unknown as { __PRELOADER_SKIP__?: number }).__PRELOADER_SKIP__) {
      setShowPreloader(false);
    } else {
      setShowPreloader(true);
    }
  }, [hasDecided]);

  const handleComplete = useCallback(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("preloaderDone", "1");
      window.dispatchEvent(new CustomEvent("preloader:complete"));
    }
    setShowPreloader(false);
  }, []);

  return (
    <>
      {/* Cover content until we've decided (prevents flash of hero on first load) */}
      {!hasDecided && (
        <div className="fixed inset-0 z-[10001] bg-white" aria-hidden />
      )}
      {showPreloader && <Preloader onComplete={handleComplete} />}
      {children}
    </>
  );
}
