import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import PreloaderGate from "@/components/PreloaderGate";
import PageTransitionProvider from "@/components/PageTransitionProvider";
import DraggableThemeToggle from "@/components/DraggableThemeToggle";
import "./globals.css";
import { DM_Mono, Manrope, Space_Grotesk } from "next/font/google";
import localFont from "next/font/local";

export const dmMono = DM_Mono({
  weight: ["300", "400", "500"],
  subsets: ["latin"],
  display: "swap",
});

export const raderFont = localFont({
  src: "../public/fonts/PPRader-Regular.otf",
  display: "swap",
  variable: "--font-rader",
});

export const manrope = Manrope({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
});

export const spaceGrotesk = Space_Grotesk({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Sadman Hossain</title>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('theme');if(t==='dark'||(t!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark');else document.documentElement.classList.remove('dark');})();`,
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
        <PreloaderGate>
          <SmoothScrollProvider>
            <PageTransitionProvider>
              {children}
            </PageTransitionProvider>
          </SmoothScrollProvider>
        </PreloaderGate>
        {/* Theme toggle: draggable/throwable; locks when in bottom-left corner */}
        <DraggableThemeToggle />
      </body>
    </html>
  );
}
