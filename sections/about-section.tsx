import { Container } from "@/components/container";

const STATS = [
  { value: "4+", label: "Projetos desenvolvidos" },
  { value: "ADS", label: "Formação na UNIFIP" },
  { value: "1", label: "Estágio em Front-end" },
  { value: "10+", label: "Tecnologias no dia a dia" },
];

const HIGHLIGHTS = [
  "Estudante de ADS na UNIFIP",
  "Estágio em desenvolvimento front-end no i5LAB",
  "Experiência full stack com React, Next.js, Java e Spring Boot",
  "Busca constante por interfaces mais elegantes e profissionais",
];

export function AboutSection() {
  return (
    <section id="sobre" className="py-28">
      <Container>

        {/* ── Label ── */}
        <div className="reveal mb-14">
          <span className="font-mono text-xs tracking-widest text-violet-400/55">
            01 — Sobre
          </span>
        </div>

        {/* ── Stats ── */}
        <div className="mb-14 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className="reveal glass rounded-2xl p-5"
              style={{ "--rd": `${0.07 + i * 0.07}s` } as React.CSSProperties}
            >
              <p className="font-display text-3xl font-bold text-white/90 sm:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1.5 text-sm leading-snug text-white/40">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* ── Main ── */}
        <div className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">

          {/* Bio */}
          <article
            className="reveal from-left glass gradient-stroke shine rounded-[1.25rem] p-8 sm:p-10"
            style={{ "--rd": "0.12s" } as React.CSSProperties}
          >
            <h2 className="font-display text-3xl font-bold leading-tight tracking-[-0.04em] text-white/90 sm:text-4xl">
              Formação em tecnologia, foco em front-end e produto.
            </h2>
            <div className="mt-8 space-y-5 text-base leading-8 text-white/42 sm:text-lg">
              <p>
                Sou Adriano Da Silva Dantas Junior, desenvolvedor de software
                com foco em front-end. Gosto de transformar ideias em
                interfaces com boa estrutura, visual refinado e navegação
                objetiva — sempre buscando uma entrega mais madura do que o
                básico.
              </p>
              <p>
                Atualmente curso Análise e Desenvolvimento de Sistemas na
                UNIFIP, o que fortalece minha base em lógica, arquitetura e
                boas práticas de software. Já atuei como estagiário de
                front-end no i5LAB, prototipando telas no Figma e
                implementando interfaces em React, Next.js e Tailwind CSS.
              </p>
              <p>
                Meu foco está em evoluir continuamente na criação de interfaces
                modernas, responsivas e bem polidas — unindo técnica,
                organização visual e uma presença digital mais profissional.
              </p>
            </div>
          </article>

          {/* Highlights */}
          <aside
            className="reveal from-right glass-strong gradient-stroke flex flex-col rounded-[1.25rem] p-8 sm:p-10"
            style={{ "--rd": "0.18s" } as React.CSSProperties}
          >
            <span className="font-mono text-xs tracking-widest text-violet-400/55">
              Destaques
            </span>
            <h3 className="font-display mt-4 text-2xl font-bold tracking-[-0.04em] text-white/85">
              Tecnologia, estética e intenção no mesmo projeto.
            </h3>

            <div className="mt-8 flex flex-col gap-2.5">
              {HIGHLIGHTS.map((item, i) => (
                <div
                  key={item}
                  className="reveal flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.025] px-4 py-4 text-sm font-medium text-white/50 transition hover:border-violet-500/20 hover:bg-violet-500/[0.04] hover:text-white/70"
                  style={
                    { "--rd": `${0.26 + i * 0.07}s` } as React.CSSProperties
                  }
                >
                  <span className="mt-0.5 shrink-0 font-mono text-xs text-violet-400/50">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {item}
                </div>
              ))}
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
}
