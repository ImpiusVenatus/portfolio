import FooterSection from "@/components/FooterSection";
import Navbar from "@/components/Navbar";
import ProjectsPageContent from "@/components/pages/projects/ProjectsPageContent";

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-page-bg">
      <Navbar />
      <ProjectsPageContent />
      <FooterSection />
    </main>
  );
}

