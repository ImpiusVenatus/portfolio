import FooterSection from "@/components/FooterSection";
import Navbar from "@/components/Navbar";
import ServicesPageContent from "@/components/pages/services/ServicesPageContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Full stack web development services by Sadman Hossain in Bangladesh, including frontend, backend, mobile apps, APIs, and AI integrations.",
  alternates: {
    canonical: "/services",
  },
};

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-page-bg">
      <Navbar />
      <ServicesPageContent />
      <FooterSection />
    </main>
  );
}

