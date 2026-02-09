"use client";

import React, { useCallback, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import PageTransition from "./PageTransition";

type PageTransitionContextValue = {
  navigateWithTransition: (href: string) => void;
};

const PageTransitionContext = React.createContext<PageTransitionContextValue | null>(null);

export function usePageTransition() {
  const ctx = useContext(PageTransitionContext);
  return ctx;
}

export default function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [showTransition, setShowTransition] = useState(false);
  const [targetHref, setTargetHref] = useState<string | null>(null);

  const navigateWithTransition = useCallback(
    (href: string) => {
      if (href.startsWith("/") && !href.startsWith("//")) {
        setTargetHref(href);
        setShowTransition(true);
      } else {
        window.location.href = href;
      }
    },
    []
  );

  const handleTransitionComplete = useCallback(() => {
    if (targetHref) {
      router.push(targetHref);
    }
    // Keep overlay visible until pathname has updated (see useEffect)
  }, [targetHref, router]);

  // Hide overlay only after the new page is active, avoiding flash of previous page
  useEffect(() => {
    if (!targetHref || !showTransition) return;
    if (pathname === targetHref) {
      setShowTransition(false);
      setTargetHref(null);
    }
  }, [pathname, targetHref, showTransition]);

  return (
    <PageTransitionContext.Provider value={{ navigateWithTransition }}>
      {children}
      {showTransition && <PageTransition onComplete={handleTransitionComplete} />}
    </PageTransitionContext.Provider>
  );
}
