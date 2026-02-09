import Navbar from "@/components/Navbar";
import ContactPageContent from "@/components/ContactPageContent";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#070C10]">
      <Navbar />
      <section className="relative z-20 min-h-screen w-full flex flex-col items-center justify-center bg-[#101318] pt-20 pb-12 px-6 sm:px-10 md:px-14">
        <ContactPageContent />
      </section>
    </main>
  );
}
