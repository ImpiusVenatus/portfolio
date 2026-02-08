"use client";

import { useState } from "react";
import Preloader from "./Preloader";

export default function PreloaderGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showPreloader, setShowPreloader] = useState(true);

  const handleComplete = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("preloaderDone", "1");
      window.dispatchEvent(new CustomEvent("preloader:complete"));
    }
    setShowPreloader(false);
  };

  return (
    <>
      {showPreloader && <Preloader onComplete={handleComplete} />}
      {children}
    </>
  );
}
