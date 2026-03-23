import FooterSection from "@/components/FooterSection";
import Navbar from "@/components/Navbar";
import ProjectsPageContent from "@/components/pages/projects/ProjectsPageContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Explore projects by Sadman Hossain across fintech, remittance, diaspora services, and applied AI product development.",
  alternates: {
    canonical: "/projects",
  },
};

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-page-bg">
      <Navbar />
      <ProjectsPageContent />
      <FooterSection />
    </main>
  );
}

