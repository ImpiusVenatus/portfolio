"use client";

import Image from "next/image";
import React, { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { dmMono } from "@/app/layout";
import { usePageTransition } from "./PageTransitionProvider";
import TransitionLink from "./TransitionLink";
import { HamburgerMenuOverlay, type MenuItem } from "./lightswind/hamburger-menu-overlay";

type NavItem = { label: string; href: string };

const NAV_ITEMS: NavItem[] = [
  { label: "PROJECTS", href: "/projects" },
  { label: "ABOUT ME", href: "/about" },
  { label: "SERVICES", href: "/services" },
  { label: "CONTACT", href: "/contact" },
];

function NavLink({ label, href, onInternalNavigate }: NavItem & { onInternalNavigate?: () => void }) {
  const isInternal = href.startsWith("/") && !href.startsWith("//");
  const handleClick = (e: React.MouseEvent) => {
    if (isInternal && onInternalNavigate) {
      e.preventDefault();
      onInternalNavigate();
    }
  };
  return (
    <a href={href} onClick={handleClick} className="group relative inline-flex items-center justify-center">
      <span className="pointer-events-none absolute -left-4 top-1/2 -translate-y-1/2 opacity-0 -translate-x-1 transition-all duration-200 ease-out group-hover:opacity-100 group-hover:translate-x-0">
        <Image
          src="/icons/hero-bracket.svg"
          alt=""
          width={6}
          height={6}
          className="opacity-90 invert dark:invert-0"
        />
      </span>

      <span className="text-text-muted transition-colors duration-200 group-hover:text-foreground">
        {label}
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
  );
}

function MenuIconButton({
  btnRef,
  onClick,
}: {
  btnRef: React.RefObject<HTMLButtonElement | null>;
  onClick: () => void;
}) {
  return (
    <button
      ref={btnRef}
      type="button"
      aria-label="Open menu"
      onClick={onClick}
      className="
        fixed top-10 right-14 z-[9999]
        h-12 w-12
        inline-flex items-center justify-center
        text-foreground/90 hover:text-foreground
        transition
        cursor-pointer
      "
    >
      <span className="relative block w-5 h-4">
        <span className="menu-line-top absolute left-0 top-0 block h-[2px] w-full bg-current origin-center" />
        <span className="menu-line-mid absolute left-0 top-1/2 -translate-y-1/2 block h-[2px] w-full bg-current origin-center" />
        <span className="menu-line-bot absolute left-0 bottom-0 block h-[2px] w-full bg-current origin-center" />
      </span>
    </button>
  );
}

export default function Navbar() {
  const pageTransition = usePageTransition();
  const headerWrapRef = useRef<HTMLDivElement | null>(null);
  const menuBtnRef = useRef<HTMLButtonElement | null>(null);

  const [open, setOpen] = useState(false);

  const overlayMenuItems: MenuItem[] = useMemo(
    () =>
      NAV_ITEMS.map((item) => ({
        label: item.label,
        href: item.href,
        onClick:
          item.href.startsWith("/") && pageTransition
            ? () => {
                setOpen(false);
                pageTransition.navigateWithTransition(item.href);
              }
            : () => setOpen(false),
      })),
    [pageTransition]
  );

  // Swap config
  const THRESHOLD = 0.5;
  const GAP = 0.18;

  const showingIconRef = useRef(false);
  const swapTlRef = useRef<gsap.core.Timeline | null>(null);
  const drawerTlRef = useRef<gsap.core.Timeline | null>(null);

  const menuItems = useMemo(() => NAV_ITEMS, []);

  // ESC close + body lock
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // ✅ SWAP LISTENER (RUN ONCE, NOT DEPENDENT ON open)
  useEffect(() => {
    if (!headerWrapRef.current || !menuBtnRef.current) return;

    const headerEl = headerWrapRef.current;
    const menuBtnEl = menuBtnRef.current;

    gsap.set(headerEl, { autoAlpha: 1, y: 0 });
    gsap.set(menuBtnEl, { autoAlpha: 0, y: -12 });

    const killSwap = () => {
      swapTlRef.current?.kill();
      swapTlRef.current = null;
      gsap.killTweensOf([headerEl, menuBtnEl]);
    };

    const toIcon = () => {
      showingIconRef.current = true;
      killSwap();

      const tl = gsap.timeline();
      swapTlRef.current = tl;

      tl.to(headerEl, { autoAlpha: 0, y: -16, duration: 0.22, ease: "power2.out" });
      tl.to({}, { duration: GAP });
      tl.to(menuBtnEl, { autoAlpha: 1, y: 0, duration: 0.2, ease: "power2.out" });
    };

    const toNavbar = () => {
      showingIconRef.current = false;
      killSwap();

      // if going back to full navbar, close drawer
      setOpen(false);

      const tl = gsap.timeline();
      swapTlRef.current = tl;

      tl.to(menuBtnEl, { autoAlpha: 0, y: -12, duration: 0.18, ease: "power2.out" });
      tl.to({}, { duration: GAP });
      tl.to(headerEl, { autoAlpha: 1, y: 0, duration: 0.22, ease: "power2.out" });
    };

    const onHeroProgress = (e: Event) => {
      const ev = e as CustomEvent<{ progress: number }>;
      const p = ev.detail?.progress ?? 0;

      const shouldShowIcon = p >= THRESHOLD;

      if (shouldShowIcon && !showingIconRef.current) toIcon();
      if (!shouldShowIcon && showingIconRef.current) toNavbar();
    };

    window.addEventListener("hero:progress", onHeroProgress);

    return () => {
      window.removeEventListener("hero:progress", onHeroProgress);
      killSwap();
    };
  }, []);

  // Hamburger button <-> X animation when mobile menu open/close
  useEffect(() => {
    if (!menuBtnRef.current) return;

    const menuBtnEl = menuBtnRef.current;
    const topLine = menuBtnEl.querySelector<HTMLElement>(".menu-line-top");
    const midLine = menuBtnEl.querySelector<HTMLElement>(".menu-line-mid");
    const botLine = menuBtnEl.querySelector<HTMLElement>(".menu-line-bot");
    if (!topLine || !midLine || !botLine) return;

    const killDrawer = () => {
      drawerTlRef.current?.kill();
      drawerTlRef.current = null;
      gsap.killTweensOf([topLine, midLine, botLine]);
    };

    if (open) {
      killDrawer();
      const tl = gsap.timeline();
      drawerTlRef.current = tl;
      tl.to(midLine, { autoAlpha: 0, scaleX: 0, duration: 0.12, ease: "power2.out" }, 0);
      tl.to(topLine, { y: 7, rotate: 45, duration: 0.22, ease: "power2.out" }, 0);
      tl.to(botLine, { y: -7, rotate: -45, duration: 0.22, ease: "power2.out" }, 0);
    } else {
      killDrawer();
      const tl = gsap.timeline();
      drawerTlRef.current = tl;
      tl.to([topLine, botLine], { rotate: 0, duration: 0.18, ease: "power2.out" }, 0);
      tl.to(topLine, { y: 0, duration: 0.18, ease: "power2.out" }, 0);
      tl.to(botLine, { y: 0, duration: 0.18, ease: "power2.out" }, 0);
      tl.to(midLine, { autoAlpha: 1, scaleX: 1, duration: 0.14, ease: "power2.out" }, 0.14);
    }

    return () => killDrawer();
  }, [open]);

  const onMenuClick = () => {
    // Only allow drawer when icon is actually the active mode
    if (!showingIconRef.current) return;
    setOpen((v) => !v);
  };

  return (
    <>
      {/* Full navbar */}
      <div
        ref={headerWrapRef}
        className="fixed top-10 left-14 right-14 z-[9998] flex items-center justify-between"
      >
        <TransitionLink
          href="/"
          className={`flex items-center gap-2 tracking-widest text-sm opacity-90 ${dmMono.className} text-foreground/90 hover:text-foreground transition-colors`}
        >
          <span>||</span>
          <span className="text-lg">Md Sadman Hossain</span>
          <span>||</span>
        </TransitionLink>

        <nav className={`hidden md:flex gap-10 text-xs tracking-widest opacity-90 ${dmMono.className}`}>
          {menuItems.map((item) => (
            <NavLink
              key={item.href}
              {...item}
              onInternalNavigate={item.href.startsWith("/") ? () => pageTransition?.navigateWithTransition(item.href) : undefined}
            />
          ))}
        </nav>
      </div>

      {/* Menu icon */}
      <MenuIconButton btnRef={menuBtnRef} onClick={onMenuClick} />

      {/* Mobile menu overlay (lightswind hamburger UI) */}
      <div
        className="fixed inset-0 z-[9990]"
        style={{ pointerEvents: open ? "auto" : "none" }}
        aria-hidden={!open}
      >
        <HamburgerMenuOverlay
          open={open}
          onOpenChange={setOpen}
          hideTrigger
          items={overlayMenuItems}
          buttonLeft="calc(100vw - 5rem)"
          buttonTop="2.5rem"
          overlayBackground="var(--mobile-menu-bg)"
          textColor="var(--mobile-menu-text)"
          fontSize="lg"
          fontFamily={dmMono.style?.fontFamily ?? '"DM Mono", monospace'}
          fontWeight="normal"
          animationDuration={0.8}
          staggerDelay={0.08}
          menuAlignment="left"
          zIndex={9990}
          keepOpenOnItemClick={false}
          ariaLabel="Open navigation menu"
        />
      </div>
    </>
  );
}
