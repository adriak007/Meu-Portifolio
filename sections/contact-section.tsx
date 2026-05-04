import { Container } from "@/components/container";
import { SectionHeading } from "@/components/section-heading";

const links = [
  {
    label: "Email",
    value: "adriak007@gmail.com",
    href: "mailto:adriak007@gmail.com",
  },
  {
    label: "GitHub",
    value: "github.com/adriak007",
    href: "https://github.com/",
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/seu-perfil",
    href: "https://www.linkedin.com/",
  },
  {
    label: "WhatsApp",
    value: "(84) 99685-0600",
    href: "https://wa.me/",
  },
];

export function ContactSection() {
  return (
    <section id="contato" className="py-24">
      <Container>
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div
            className="reveal from-left surface-panel gradient-stroke rounded-[2rem] p-8 sm:p-10"
            style={{ "--rd": "0.05s" } as React.CSSProperties}
          >
            <SectionHeading
              eyebrow="Contato"
              title="Aberto a novas conexoes, ideias e oportunidades."
              description="Se quiser conversar sobre projetos, front-end ou alguma oportunidade profissional, este e o melhor ponto de contato."
            />
          </div>

          <div
            className="reveal from-right surface-panel-strong gradient-stroke rounded-[2rem] p-5 sm:p-6"
            style={{ "--rd": "0.1s" } as React.CSSProperties}
          >
            <div className="grid gap-4">
              {links.map((link, i) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.label === "Email" ? undefined : "_blank"}
                  rel={link.label === "Email" ? undefined : "noreferrer"}
                  className="reveal shine group rounded-[1.5rem] border border-violet-200/80 bg-white/75 px-5 py-5 transition hover:-translate-y-1 hover:border-violet-300 hover:bg-white hover:shadow-[0_12px_32px_rgba(109,63,210,0.12)]"
                  style={{ "--rd": `${0.15 + i * 0.07}s` } as React.CSSProperties}
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
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-100/80 text-violet-700 transition group-hover:bg-violet-600 group-hover:text-white group-hover:translate-x-0.5">
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                        <path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
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
