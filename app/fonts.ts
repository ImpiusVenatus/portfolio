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
