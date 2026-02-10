import FooterSection from "@/components/FooterSection";
import Navbar from "@/components/Navbar";
import ProjectsSection from "@/components/ProjectsSection";

export default function ProjectsPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      {/* Intro section */}
      <section className="relative h-screen w-screen flex flex-col items-center justify-center text-center bg-section-bg text-foreground">
        <div className="space-y-4">
          <div className={`text-[10px] tracking-[0.28em] text-text-muted uppercase ${"font-mono"}`}>
            SELECTED PROJECTS
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-heading">
            Product work across fintech, AI & apps.
          </h1>
          <p className="max-w-2xl mx-auto mt-4 text-text-muted text-sm md:text-base leading-relaxed">
            Scroll to explore the case studies. Each slide locks into view, with context on the left, a live mockup in the
            middle, and a focused breakdown on the right.
          </p>
        </div>
      </section>

      {/* Pinned carousel section */}
      <ProjectsSection />
      <FooterSection />
    </main>
  );
}

