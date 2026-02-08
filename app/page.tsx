import FeaturedWorkSection from "@/components/FeaturedWorkSection";
import Hero from "@/components/Hero";
import Navbar from "@/components/Navbar";
import ServicesSection from "@/components/ServicesSection";
import TextSection from "@/components/TextSection";

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <ServicesSection />
      <TextSection />
      <FeaturedWorkSection />
    </main>
  );
}
