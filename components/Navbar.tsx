"use client";

import Image from "next/image";
import React, { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { dmMono } from "@/app/layout";

type NavItem = { label: string; href: string };

const NAV_ITEMS: NavItem[] = [
  { label: "PROJECTS", href: "#projects" },
  { label: "ABOUT ME", href: "#about" },
  { label: "SERVICES", href: "#services" },
  { label: "CONTACT", href: "#contact" },
];

function NavLink({ label, href }: NavItem) {
  return (
    <a href={href} className="group relative inline-flex items-center justify-center">
      <span className="pointer-events-none absolute -left-4 top-1/2 -translate-y-1/2 opacity-0 -translate-x-1 transition-all duration-200 ease-out group-hover:opacity-100 group-hover:translate-x-0">
        <Image src="/icons/hero-bracket.svg" alt="" width={6} height={6} className="opacity-90" />
      </span>

      <span className="text-white/70 transition-colors duration-200 group-hover:text-white">
        {label}
      </span>

      <span className="pointer-events-none absolute -right-4 top-1/2 -translate-y-1/2 opacity-0 translate-x-1 transition-all duration-200 ease-out group-hover:opacity-100 group-hover:translate-x-0">
        <Image
          src="/icons/hero-bracket.svg"
          alt=""
          width={6}
          height={6}
          className="opacity-90 rotate-180"
        />
      </span>
    </a>
  );
}

/** Random chars -> settles to final text */
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
        text-white/90 hover:text-white
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
  const headerWrapRef = useRef<HTMLDivElement | null>(null);
  const menuBtnRef = useRef<HTMLButtonElement | null>(null);

  const panelRef = useRef<HTMLDivElement | null>(null);
  const backdropRef = useRef<HTMLDivElement | null>(null);

  const itemRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  itemRefs.current = [];

  const [open, setOpen] = useState(false);

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

  // ✅ DRAWER ANIMATION (POP + SCRAMBLE ONLY)
  useEffect(() => {
    if (!menuBtnRef.current || !panelRef.current || !backdropRef.current) return;

    const menuBtnEl = menuBtnRef.current;
    const panelEl = panelRef.current;
    const backdropEl = backdropRef.current;

    const topLine = menuBtnEl.querySelector<HTMLElement>(".menu-line-top");
    const midLine = menuBtnEl.querySelector<HTMLElement>(".menu-line-mid");
    const botLine = menuBtnEl.querySelector<HTMLElement>(".menu-line-bot");
    if (!topLine || !midLine || !botLine) return;

    // base drawer states
    gsap.set(backdropEl, { autoAlpha: 0 });
    gsap.set(panelEl, {
      autoAlpha: 0,
      scale: 0.6,
      transformOrigin: "top right",
    });

    // items hidden (no slide)
    const items = itemRefs.current.filter(Boolean) as HTMLElement[];
    gsap.set(items, { autoAlpha: 0 });

    const killDrawer = () => {
      drawerTlRef.current?.kill();
      drawerTlRef.current = null;
      gsap.killTweensOf([topLine, midLine, botLine, panelEl, backdropEl, ...items]);
    };

    const openDrawer = () => {
      killDrawer();

      const tl = gsap.timeline();
      drawerTlRef.current = tl;

      // hamburger -> X
      tl.to(midLine, { autoAlpha: 0, scaleX: 0, duration: 0.12, ease: "power2.out" }, 0);
      tl.to(topLine, { y: 7, rotate: 45, duration: 0.22, ease: "power2.out" }, 0);
      tl.to(botLine, { y: -7, rotate: -45, duration: 0.22, ease: "power2.out" }, 0);

      // backdrop
      tl.to(backdropEl, { autoAlpha: 1, duration: 0.16, ease: "power2.out" }, 0.05);

      tl.to(
        panelEl,
        {
          autoAlpha: 1,
          scale: 1,
          duration: 0.28,
          ease: "back.out(1.7)",
        },
        0.06
      );

      const FIRST_ITEM_DELAY = 0.35;
      const ITEM_STAGGER = 0.18;
      const SCRAMBLE_TIME = 0.75;

      items.forEach((el, idx) => {
        const label = el.getAttribute("data-label") ?? "";

        const t = FIRST_ITEM_DELAY + idx * ITEM_STAGGER;

        // show item (instant)
        tl.set(el, { autoAlpha: 1 }, t);

        // scramble into final text
        tl.add(scrambleTo(el, label, SCRAMBLE_TIME), t);
      });
    };

    const closeDrawer = () => {
      killDrawer();

      const tl = gsap.timeline();
      drawerTlRef.current = tl;

      // hide items fast
      tl.to(items, { autoAlpha: 0, duration: 0.08, ease: "power2.out", stagger: 0.02 }, 0);

      // pop out panel
      tl.to(
        panelEl,
        { autoAlpha: 0, scale: 0.75, duration: 0.16, ease: "power2.out" },
        0.02
      );

      tl.to(backdropEl, { autoAlpha: 0, duration: 0.14, ease: "power2.out" }, 0.02);

      // X -> hamburger
      tl.to([topLine, botLine], { rotate: 0, duration: 0.18, ease: "power2.out" }, 0.06);
      tl.to(topLine, { y: 0, duration: 0.18, ease: "power2.out" }, 0.06);
      tl.to(botLine, { y: 0, duration: 0.18, ease: "power2.out" }, 0.06);
      tl.to(midLine, { autoAlpha: 1, scaleX: 1, duration: 0.14, ease: "power2.out" }, 0.14);
    };

    if (open) openDrawer();
    else closeDrawer();

    return () => {
      killDrawer();
    };
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
        <div className={`flex items-center gap-2 tracking-widest text-sm opacity-90 ${dmMono.className}`}>
          <span>||</span>
          <span className="text-lg">Md Sadman Hossain</span>
          <span>||</span>
        </div>

        <nav className={`hidden md:flex gap-10 text-xs tracking-widest opacity-90 ${dmMono.className}`}>
          {menuItems.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </nav>
      </div>

      {/* Menu icon */}
      <MenuIconButton btnRef={menuBtnRef} onClick={onMenuClick} />

      {/* Backdrop */}
      <div
        ref={backdropRef}
        onClick={() => setOpen(false)}
        className="fixed inset-0 z-[9990] bg-black/40 backdrop-blur-[2px]"
        style={{ pointerEvents: open ? "auto" : "none" }}
      />

      {/* Glass pop panel */}
      <div
        ref={panelRef}
        className="
          fixed top-24 right-14 z-[9991]
          w-[280px] md:w-[320px]
          rounded-3xl
          border border-white/10
          bg-white/10 backdrop-blur-xl
          shadow-2xl
          p-4
        "
        style={{ pointerEvents: open ? "auto" : "none" }}
      >
        <div className="px-2 py-2">
          <div className={`text-[11px] tracking-[0.28em] text-white/70 ${dmMono.className}`}>
            NAVIGATION
          </div>
        </div>

        <div className="mt-2 flex flex-col">
          {menuItems.map((item, idx) => (
            <a
              key={item.href}
              href={item.href}
              data-label={item.label}
              ref={(el) => {
                itemRefs.current[idx] = el;
              }}
              onClick={() => setOpen(false)}
              className={`
                px-3 py-3 rounded-2xl
                text-white/90 hover:text-white
                hover:bg-white/10
                transition
                ${dmMono.className}
                text-sm tracking-widest
              `}
            >
              {/* text will be scrambled in */}
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
