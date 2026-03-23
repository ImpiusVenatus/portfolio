import CapabilitiesSection from "@/components/CapabilitiesSection";
import FeaturedWorkSection from "@/components/FeaturedWorkSection";
import FooterSection from "@/components/FooterSection";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import ServicesSection from "@/components/ServicesSection";
import TextSection from "@/components/TextSection";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sadman Hossain - Full Stack Web Developer",
  description:
    "Portfolio of Sadman Hossain, a full stack web developer in Bangladesh building scalable web, mobile, and AI-powered products.",
  alternates: {
    canonical: "/",
  },
};

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <ServicesSection />
      <TextSection />
      <FeaturedWorkSection />
      <CapabilitiesSection />
      <FooterSection />
    </main>
  );
}
