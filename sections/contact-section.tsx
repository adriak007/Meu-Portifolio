import { Container } from "@/components/container";
import { SectionHeading } from "@/components/section-heading";

const links = [
  {
    label: "Email",
    value: "adrianojunior@ads.fiponline.edu.br",
    href: "mailto:adrianojunior@ads.fiponline.edu.br"
  },
  {
    label: "GitHub",
    value: "github.com/seu-usuario",
    href: "https://github.com/"
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/seu-perfil",
    href: "https://www.linkedin.com/"
  },
  {
    label: "WhatsApp",
    value: "(00) 00000-0000",
    href: "https://wa.me/"
  }
];

export function ContactSection() {
  return (
    <section id="contato" className="py-24">
      <Container>
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="surface-panel gradient-stroke rounded-[2rem] p-8 sm:p-10">
            <SectionHeading
              eyebrow="Contato"
              title="Aberto a novas conexoes, ideias e oportunidades."
              description="Se quiser conversar sobre projetos, front-end ou alguma oportunidade profissional, este e o melhor ponto de contato."
            />
          </div>

          <div className="surface-panel-strong gradient-stroke rounded-[2rem] p-5 sm:p-6">
            <div className="grid gap-4">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.label === "Email" ? undefined : "_blank"}
                  rel={link.label === "Email" ? undefined : "noreferrer"}
                  className="group rounded-[1.5rem] border border-violet-200/80 bg-white/75 px-5 py-5 transition hover:-translate-y-1 hover:border-violet-300 hover:bg-white"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-violet-900">
                        {link.label}
                      </p>
                      <p className="mt-2 text-sm font-semibold text-slate-700 sm:text-base">
                        {link.value}
                      </p>
                    </div>
                    <span className="text-lg text-violet-700 transition group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </a>
              ))}
            </div>

            <p className="mt-5 px-1 text-sm leading-7 text-[color:var(--muted)]">
              GitHub, LinkedIn e WhatsApp estao como placeholders para voce
              substituir pelos links reais depois.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
