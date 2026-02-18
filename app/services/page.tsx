import FooterSection from "@/components/FooterSection";
import Navbar from "@/components/Navbar";
import ServicesPageContent from "@/components/pages/services/ServicesPageContent";

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-page-bg">
      <Navbar />
      <ServicesPageContent />
      <FooterSection />
    </main>
  );
}

