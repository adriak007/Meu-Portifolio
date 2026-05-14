import { Container } from "@/components/container";

const LINKS = [
  {
    label: "Email",
    value: "adriak007@gmail.com",
    href: "mailto:adriak007@gmail.com",
    external: false,
  },
  {
    label: "GitHub",
    value: "github.com/adriak007",
    href: "https://github.com/adriak007",
    external: true,
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/seu-perfil",
    href: "https://www.linkedin.com/",
    external: true,
  },
  {
    label: "WhatsApp",
    value: "(84) 99685-0600",
    href: "https://wa.me/5584996850600",
    external: true,
  },
];

export function ContactSection() {
  return (
    <section id="contato" className="py-28">
      <Container>

        {/* ── Header ── */}
        <div className="reveal mb-16">
          <span className="font-mono text-xs tracking-widest text-violet-400/55">
            03 — Contato
          </span>
          <h2 className="font-display mt-4 text-4xl font-bold tracking-[-0.04em] text-white/90 sm:text-5xl lg:text-6xl">
            Vamos trabalhar{" "}
            <span className="gradient-text">juntos.</span>
          </h2>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-white/40">
            Aberto a novas conexões, ideias e oportunidades. Se quiser conversar
            sobre projetos, front-end ou alguma oportunidade profissional, este
            é o melhor ponto de contato.
          </p>
        </div>

        {/* ── Links ── */}
        <div className="grid gap-3 sm:grid-cols-2">
          {LINKS.map((link, i) => (
            <a
              key={link.label}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noreferrer" : undefined}
              className="reveal shine group flex items-center justify-between rounded-[1rem] border border-white/[0.07] bg-white/[0.025] px-6 py-5 transition hover:-translate-y-0.5 hover:border-violet-500/25 hover:bg-violet-500/[0.04]"
              style={{ "--rd": `${0.12 + i * 0.07}s` } as React.CSSProperties}
            >
              <div>
                <p className="font-mono text-xs tracking-widest text-violet-400/65">
                  {link.label}
                </p>
                <p className="mt-2 text-sm font-semibold text-white/65 transition group-hover:text-white/90 sm:text-base">
                  {link.value}
                </p>
              </div>
              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.07] bg-white/[0.03] text-white/30 transition group-hover:translate-x-0.5 group-hover:border-violet-500/28 group-hover:bg-violet-500/[0.08] group-hover:text-violet-300">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M2 7H12M8 3L12 7L8 11"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}
