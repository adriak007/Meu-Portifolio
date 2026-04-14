import { Container } from "@/components/container";
import { ProjectCarousel } from "@/components/project-carousel";
import { SectionHeading } from "@/components/section-heading";
import { projects } from "@/data/projects";

export function ProjectsSection() {
  return (
    <section id="projetos" className="mesh-section py-24">
      <Container>
        <SectionHeading
          eyebrow="Projetos"
          title="Um showcase mais premium para apresentar evolucao visual, tecnica e cuidado com o acabamento."
          description="A vitrine principal do portfolio foi pensada como um carrossel moderno, com foco no projeto central, transicoes suaves e navegacao fluida."
          align="center"
        />
        <ProjectCarousel projects={projects} />
      </Container>
    </section>
  );
}
