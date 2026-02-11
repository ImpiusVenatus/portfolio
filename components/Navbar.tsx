"use client";

import Image from "next/image";
import React, { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { PanelRightClose, PanelLeftOpen } from "lucide-react";
import { dmMono } from "@/app/layout";
import { usePageTransition } from "./PageTransitionProvider";
import TransitionLink from "./TransitionLink";
import { HamburgerMenuOverlay, type MenuItem } from "./lightswind/hamburger-menu-overlay";
import { cn } from "@/lib/utils";

const MD_BREAKPOINT = 768;

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

function HamburgerIcon({ className }: { className?: string }) {
  return (
    <span className={cn("relative block w-5 h-4", className)}>
      <span className="menu-line-top absolute left-0 top-0 block h-[2px] w-full bg-current origin-center" />
      <span className="menu-line-mid absolute left-0 top-1/2 -translate-y-1/2 block h-[2px] w-full bg-current origin-center" />
      <span className="menu-line-bot absolute left-0 bottom-0 block h-[2px] w-full bg-current origin-center" />
    </span>
  );
}

export default function Navbar() {
  const pageTransition = usePageTransition();
  const menuBtnRef = useRef<HTMLButtonElement | null>(null);

  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navbarRef = useRef<HTMLDivElement | null>(null);

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

  const menuItems = useMemo(() => NAV_ITEMS, []);
  const drawerTlRef = useRef<gsap.core.Timeline | null>(null);

  // Responsive: mobile = hamburger by default
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < MD_BREAKPOINT);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // When switching to mobile, collapse state is irrelevant; reset when we go desktop
  useEffect(() => {
    if (isMobile) setCollapsed(false);
  }, [isMobile]);

  // Expand animation: navbar grows from hamburger position
  const prevCollapsedRef = useRef(collapsed);
  useEffect(() => {
    if (!navbarRef.current || isMobile) return;
    const el = navbarRef.current;
    if (collapsed) {
      prevCollapsedRef.current = true;
      return;
    }
    if (prevCollapsedRef.current) {
      prevCollapsedRef.current = false;
      gsap.set(el, { scaleX: 0, transformOrigin: "left center" });
      gsap.to(el, {
        scaleX: 1,
        duration: 0.35,
        ease: "power2.out",
        overwrite: true,
      });
    } else {
      gsap.set(el, { scaleX: 1, transformOrigin: "left center" });
    }
  }, [collapsed, isMobile]);

  const handleCollapse = () => {
    if (!navbarRef.current) return;
    gsap.to(navbarRef.current, {
      scaleX: 0,
      transformOrigin: "left center",
      duration: 0.35,
      ease: "power2.in",
      overwrite: true,
      onComplete: () => {
        prevCollapsedRef.current = true;
        setCollapsed(true);
      },
    });
  };

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

  // Desktop: when collapsed, hamburger on left (opens overlay) + expand button on right (expands navbar).
  // Mobile: hamburger on left only, opens overlay.
  const showLeftIcon = isMobile || collapsed;

  return (
    <>
      {/* Desktop navbar: compressible part (logo + nav) + collapse/expand button on right */}
      {!isMobile && (
        <div className="fixed top-10 left-14 right-14 z-[9998] flex items-center justify-between">
          {/* Compressible part: logo + nav links */}
          <div
            ref={navbarRef}
            className={cn(
              "flex items-center flex-1 min-w-0 origin-left",
              !collapsed ? "opacity-100" : "pointer-events-none opacity-0"
            )}
          >
            <TransitionLink
              href="/"
              className={`flex items-center gap-2 tracking-widest text-sm opacity-90 flex-shrink-0 ${dmMono.className} text-foreground/90 hover:text-foreground transition-colors`}
            >
              <span>||</span>
              <span className="text-lg">Md Sadman Hossain</span>
              <span>||</span>
            </TransitionLink>

            <div className="ml-auto flex items-center gap-10">
              <nav className={`flex gap-10 text-xs tracking-widest opacity-90 ${dmMono.className}`}>
                {menuItems.map((item) => (
                  <NavLink
                    key={item.href}
                    {...item}
                    onInternalNavigate={item.href.startsWith("/") ? () => pageTransition?.navigateWithTransition(item.href) : undefined}
                  />
                ))}
              </nav>
            </div>
          </div>

          {/* Collapse/expand button - always visible on right */}
          <button
            type="button"
            aria-label={collapsed ? "Expand navbar" : "Collapse navbar"}
            onClick={collapsed ? () => setCollapsed(false) : handleCollapse}
            className="h-12 w-12 flex-shrink-0 ml-4 inline-flex items-center justify-center text-foreground/80 hover:text-foreground transition-colors cursor-pointer"
          >
            {collapsed ? (
              <PanelLeftOpen className="w-5 h-5" strokeWidth={1.5} />
            ) : (
              <PanelRightClose className="w-5 h-5" strokeWidth={1.5} />
            )}
          </button>
        </div>
      )}

      {/* Mobile: hamburger on left, opens overlay only (no expand) */}
      {showLeftIcon && (
        <button
          ref={menuBtnRef}
          type="button"
          aria-label="Open menu"
          onClick={() => setOpen((v) => !v)}
          className={cn(
            "fixed top-10 left-14 z-[9999]",
            "h-12 w-12 inline-flex items-center justify-center transition cursor-pointer",
            open ? "text-white dark:text-[#101318]" : "text-[#101318] dark:text-white"
          )}
        >
          <HamburgerIcon />
        </button>
      )}

      {/* Mobile menu overlay (lightswind hamburger UI) - hamburger on left for mobile */}
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
          buttonLeft="3.5rem"
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
