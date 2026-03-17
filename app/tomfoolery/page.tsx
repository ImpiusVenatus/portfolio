import Navbar from "@/components/Navbar";
import FooterSection from "@/components/FooterSection";
import TomfooleryPageContent from "@/components/pages/tomfoolery/TomfooleryPageContent";

export default function TomfooleryPage() {
  return (
    <main className="min-h-screen bg-page-bg">
      <Navbar />
      <section className="relative z-20 min-h-screen w-full flex flex-col items-center pt-28 pb-12 px-6 sm:px-10 md:px-14 bg-section-bg">
        <TomfooleryPageContent />
      </section>
      <FooterSection />
    </main>
  );
}

