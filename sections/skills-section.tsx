import { Container } from "@/components/container";

const SKILL_GROUPS = [
  {
    title: "Linguagens",
    items: ["JavaScript", "TypeScript", "Java", "C#", "SQL", "Python"],
  },
  {
    title: "Front-end",
    items: ["React", "Next.js", "HTML", "CSS", "Tailwind CSS"],
  },
  {
    title: "Back-end & APIs",
    items: ["Node.js", "Spring Boot", "REST APIs", "Integração de APIs"],
  },
  {
    title: "Bancos de Dados",
    items: ["PostgreSQL", "MySQL", "SQLite"],
  },
  {
    title: "Ferramentas",
    items: ["Git", "GitHub", "Docker", "VS Code", "IntelliJ", "Figma"],
  },
  {
    title: "Engenharia de Software",
    items: [
      "POO",
      "Clean Code",
      "Arquitetura de Software",
      "Design Responsivo",
      "Metodologias Ágeis",
    ],
  },
  {
    title: "Outros",
    items: ["Godot", "Unity", "Automação", "Resolução de Problemas"],
  },
];

export function SkillsSection() {
  return (
    <section id="habilidades" className="py-28">
      <Container>
        {/* ── Label ── */}
        <div className="reveal mb-14">
          <span className="font-mono text-xs tracking-widest text-violet-400/55">
            02 — Habilidades
          </span>
          <h2 className="font-display mt-4 max-w-xl text-3xl font-bold leading-tight tracking-[-0.04em] text-white/90 sm:text-4xl">
            Stack e ferramentas com as quais trabalho no dia a dia.
          </h2>
        </div>

        {/* ── Groups ── */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SKILL_GROUPS.map((group, i) => (
            <div
              key={group.title}
              className="reveal glass gradient-stroke rounded-[1.25rem] p-6 sm:p-7"
              style={{ "--rd": `${0.06 + i * 0.06}s` } as React.CSSProperties}
            >
              <span className="font-mono text-xs tracking-widest text-violet-400/55">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display mt-2 text-lg font-bold text-white/85">
                {group.title}
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/[0.07] bg-white/[0.025] px-3.5 py-1.5 text-xs font-medium text-white/55 transition hover:border-violet-500/25 hover:bg-violet-500/[0.06] hover:text-white/80"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
