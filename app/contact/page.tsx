import Navbar from "@/components/Navbar";
import ContactPageContent from "@/components/pages/contact/ContactPageContent";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-page-bg">
      <Navbar />
      <section className="relative z-20 min-h-screen w-full flex flex-col items-center justify-center bg-section-bg pt-28 pb-12 px-6 sm:px-10 md:px-14">
        <ContactPageContent />
      </section>
    </main>
  );
}
