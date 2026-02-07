import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import "./globals.css";
import { DM_Mono, Manrope, Space_Grotesk } from "next/font/google";

export const dmMono = DM_Mono({
  weight: ["300", "400", "500"],
  subsets: ["latin"],
  display: "swap",
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
      <body
        className={`bg-[#070C10] text-white overflow-x-hidden ${manrope.className}`}
      >
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
