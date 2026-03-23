import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import PreloaderGate from "@/components/PreloaderGate";
import PageTransitionProvider from "@/components/PageTransitionProvider";
import DraggableThemeToggle from "@/components/DraggableThemeToggle";
import BackToTop from "@/components/BackToTop";
import { NavbarContrastProvider } from "@/components/NavbarContrastProvider";
import { manrope } from "@/app/fonts";
import "./globals.css";
import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const siteUrl = new URL(SITE_URL);

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: "Sadman Hossain | Full Stack Web Developer in Bangladesh",
    template: "%s | Sadman Hossain",
  },
  description:
    "Sadman Hossain is a full stack web developer in Bangladesh specializing in React, Next.js, TypeScript, Node.js, FastAPI, and AI-powered product development.",
  keywords: [
    "Sadman Hossain",
    "full stack web developer",
    "full stack developer in Bangladesh",
    "developer in Bangladesh",
    "software engineer Bangladesh",
    "Next.js developer",
    "React developer",
    "TypeScript developer",
    "FastAPI developer",
    "portfolio",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    title: "Sadman Hossain | Full Stack Web Developer in Bangladesh",
    description:
      "Portfolio of Sadman Hossain - full stack web developer building fintech and applied AI products.",
    siteName: "Sadman Hossain Portfolio",
    images: [
      {
        url: "/sadman-hossain.jpg",
        width: 1200,
        height: 1600,
        alt: "Sadman Hossain",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sadman Hossain | Full Stack Web Developer in Bangladesh",
    description:
      "Portfolio of Sadman Hossain - full stack web developer building fintech and applied AI products.",
    images: ["/sadman-hossain.jpg"],
  },
  authors: [{ name: "Sadman Hossain" }],
  creator: "Sadman Hossain",
  category: "technology",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme');if(t==='dark'||(t!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark');else document.documentElement.classList.remove('dark');})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Sadman Hossain",
              url: SITE_URL,
              image: `${SITE_URL}/sadman-hossain.jpg`,
              jobTitle: "Full Stack Web Developer",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Dhaka",
                addressCountry: "Bangladesh",
              },
              knowsAbout: [
                "Full Stack Web Development",
                "React",
                "Next.js",
                "TypeScript",
                "Node.js",
                "FastAPI",
                "Applied AI",
              ],
            }),
          }}
        />
      </head>
      <body
        className={`bg-background text-foreground overflow-x-hidden ${manrope.className}`}
      >
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(sessionStorage.getItem('preloaderDone'))window.__PRELOADER_SKIP__=1;}catch(e){}})();`,
          }}
        />
        <NavbarContrastProvider>
          <PreloaderGate>
            <SmoothScrollProvider>
              <PageTransitionProvider>
                {children}
              </PageTransitionProvider>
            </SmoothScrollProvider>
          </PreloaderGate>
{/* Theme toggle: draggable/throwable; locks when in bottom-left corner */}
        <DraggableThemeToggle />
        <BackToTop />
        </NavbarContrastProvider>
      </body>
    </html>
  );
}
