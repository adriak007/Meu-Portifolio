import Image from "next/image";
import { Container } from "@/components/container";
import { projects } from "@/data/projects";

export function ProjectsSection() {
  return (
    <section id="projetos" className="py-28">
      <Container>

        {/* ── Header ── */}
        <div className="reveal mb-16">
          <span className="font-mono text-xs tracking-widest text-violet-400/55">
            03 — Projetos
          </span>
          <h2 className="font-display mt-4 text-4xl font-bold tracking-[-0.04em] text-white/90 sm:text-5xl">
            O que eu construí.
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-white/40">
            Um showcase com foco em evolução visual, técnica e atenção ao
            acabamento.
          </p>
        </div>

        {/* ── Grid ── */}
        <div className="grid gap-5 sm:grid-cols-2">
          {projects.map((project, i) => (
            <article
              key={project.id}
              className="reveal project-card shine group relative overflow-hidden rounded-[1.25rem] border border-white/[0.07] bg-white/[0.03]"
              style={{ "--rd": `${i * 0.09}s` } as React.CSSProperties}
            >
              {/* Number badge */}
              <span className="absolute right-4 top-4 z-20 font-mono text-xs font-semibold text-white/20">
                {String(project.id).padStart(2, "0")}
              </span>

              {/* Image / fallback */}
              <div className="relative overflow-hidden">
                <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-transparent to-[#0c0c14]" />
                {project.image ? (
                  <Image
                    src={project.image}
                    alt={project.title}
                    width={800}
                    height={500}
                    className="project-card-img aspect-[16/10] w-full object-cover brightness-[0.65]"
                  />
                ) : (
                  <div
                    className={`project-card-img flex aspect-[16/10] w-full items-center justify-center bg-gradient-to-br ${project.accent} bg-[#13131f]`}
                  >
                    <span className="font-display text-6xl font-bold text-white/[0.12]">
                      {project.title.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <span className="font-mono text-xs tracking-wider text-violet-400/65">
                  {project.category}
                </span>
                <h3 className="font-display mt-2 text-xl font-bold text-white/90">
                  {project.title}
                </h3>
                <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-white/40">
                  {project.description}
                </p>

                {/* Tech tags */}
                <div className="mt-5 flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-white/[0.07] bg-white/[0.04] px-3 py-1 text-xs font-medium text-white/40"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
