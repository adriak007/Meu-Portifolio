import { Container } from "@/components/container";
import { SectionHeading } from "@/components/section-heading";

const highlights = [
  "Estudante de ADS na FIP",
  "Atuacao como empresario",
  "Interesse constante em desenvolvimento web",
  "Busca por interfaces mais elegantes e profissionais",
];

export function AboutSection() {
  return (
    <section id="sobre" className="py-24">
      <Container>
        <div className="reveal">
          <SectionHeading
            eyebrow="Sobre mim"
            title="Formacao em tecnologia com mentalidade de negocio e atencao real a apresentacao."
            description="Minha evolucao em desenvolvimento web passa tanto por estudo tecnico quanto por um olhar pratico para construir experiencias claras, bem organizadas e com identidade."
          />
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <article
            className="reveal from-left surface-panel gradient-stroke shine rounded-[2rem] p-8 sm:p-10"
            style={{ "--rd": "0.1s" } as React.CSSProperties}
          >
            <div className="space-y-6 text-base leading-8 text-[color:var(--muted)] sm:text-lg">
              <p>
                Sou Adriano Da Silva Dantas Junior, desenvolvedor web e
                empresario. Gosto de transformar ideias em interfaces com boa
                estrutura, visual refinado e navegacao objetiva, sempre buscando
                uma entrega mais madura do que o basico.
              </p>
              <p>
                Atualmente curso Analise e Desenvolvimento de Sistemas na FIP,
                o que fortalece minha base em logica, desenvolvimento e boas
                praticas de software. Ao mesmo tempo, minha atuacao como
                empresario amplia a forma como penso produto, posicionamento e
                valor real para quem vai usar cada projeto.
              </p>
              <p>
                Meu foco esta em evoluir continuamente na criacao de interfaces
                modernas, responsivas e bem polidas, unindo tecnica,
                organizacao visual e uma presenca digital mais profissional.
              </p>
            </div>
          </article>

          <aside
            className="reveal from-right surface-panel-strong gradient-stroke flex flex-col justify-between rounded-[2rem] p-8 sm:p-10"
            style={{ "--rd": "0.15s" } as React.CSSProperties}
          >
            <div>
              <span className="inline-flex rounded-full bg-violet-500/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.22em] text-violet-950">
                Destaques
              </span>
              <h3 className="font-display mt-5 text-3xl font-bold tracking-[-0.05em] text-slate-950">
                Tecnologia, estetica e intencao no mesmo projeto.
              </h3>
            </div>

            <div className="mt-8 space-y-3">
              {highlights.map((item, i) => (
                <div
                  key={item}
                  className="reveal rounded-2xl border border-violet-200/80 bg-white/70 px-4 py-4 text-sm font-semibold text-slate-700 transition hover:border-violet-300 hover:bg-white sm:text-base"
                  style={{ "--rd": `${0.22 + i * 0.08}s` } as React.CSSProperties}
                >
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
