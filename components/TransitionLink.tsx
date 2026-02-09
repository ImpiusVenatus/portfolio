"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { usePageTransition } from "./PageTransitionProvider";

type TransitionLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: React.ReactNode;
};

export default function TransitionLink({ href, onClick, children, ...rest }: TransitionLinkProps) {
  const pathname = usePathname();
  const pageTransition = usePageTransition();
  const isInternal = href.startsWith("/") && !href.startsWith("//");
  const isCurrentPath = pathname === href;

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isInternal && pageTransition && !isCurrentPath) {
      e.preventDefault();
      pageTransition.navigateWithTransition(href);
    }
    onClick?.(e);
  };

  return (
    <a href={href} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}
