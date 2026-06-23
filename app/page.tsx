import { AboutSection } from "@/sections/about-section";
import { ContactSection } from "@/sections/contact-section";
import { Footer } from "@/sections/footer";
import { HeroSection } from "@/sections/hero-section";
import { ProjectsSection } from "@/sections/projects-section";
import { SkillsSection } from "@/sections/skills-section";

export default function Home() {
  return (
    <main className="relative overflow-x-clip">
      <HeroSection />
      <AboutSection />
      <SkillsSection />
      <ProjectsSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
