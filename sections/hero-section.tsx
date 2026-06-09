import Link from "next/link";
import { Container } from "@/components/container";
import { PhysicsBadge } from "@/components/physics-badge";

const NAV_LINKS = [
  { label: "Sobre", href: "#sobre" },
  { label: "Projetos", href: "#projetos" },
  { label: "Contato", href: "#contato" },
];

const HEADING_LINES = [
  { text: "Frontend", className: "text-white/90" },
  { text: "Developer", className: "gradient-text" },
  { text: "Junior.", className: "text-white/35" },
];

export function HeroSection() {
  return (
    <header id="topo" className="relative min-h-screen overflow-hidden">

      {/* Grade sutil sobre o background */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        aria-hidden="true"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.032) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.032) 1px, transparent 1px)
          `,
          backgroundSize: "52px 52px",
        }}
      />

      <Container className="relative z-10">

        {/* ── Navigation ── */}
        <nav className="sticky top-4 z-30 flex items-center justify-between rounded-full border border-white/[0.07] bg-[#0c0c14]/82 px-5 py-3 backdrop-blur-xl">
          <Link href="/" className="group flex items-center gap-3">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-700 text-xs font-bold text-white shadow-[0_0_20px_rgba(124,58,237,0.45)]">
              AJ
            </span>
            <span className="font-display text-sm font-semibold text-white/65 transition group-hover:text-white/90">
              Adriano JR
            </span>
          </Link>

          <div className="flex items-center gap-0.5">
            {NAV_LINKS.map(({ label, href }) => (
              <a
                key={href}
                href={href}
                className="rounded-full px-4 py-2 text-sm font-medium text-white/40 transition hover:bg-white/[0.06] hover:text-white/85"
              >
                {label}
              </a>
            ))}
          </div>
        </nav>

        {/* ── Hero Content ── */}
        <div className="grid min-h-[calc(100vh-5.5rem)] items-center gap-10 py-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16 lg:py-20">

          {/* Left */}
          <div>
            <div
              className="hero-enter"
              style={{ "--anim-delay": "0s" } as React.CSSProperties}
            >
              <span className="inline-flex items-center gap-2.5 rounded-full border border-violet-500/20 bg-violet-500/[0.07] px-4 py-1.5 font-mono text-xs tracking-wider text-violet-300">
                Desenvolvedor Web &amp; Empresário
              </span>
            </div>

            <h1 className="mt-6">
              {HEADING_LINES.map(({ text, className }, i) => (
                <span
                  key={text}
                  className={`hero-enter font-display block text-5xl font-bold leading-[1.06] tracking-[-0.04em] sm:text-6xl lg:text-7xl xl:text-[5.5rem] ${className}`}
                  style={
                    { "--anim-delay": `${0.1 + i * 0.065}s` } as React.CSSProperties
                  }
                >
                  {text}
                </span>
              ))}
            </h1>

            <p
              className="hero-enter mt-8 max-w-[420px] text-lg leading-relaxed text-white/40 sm:text-xl"
              style={{ "--anim-delay": "0.34s" } as React.CSSProperties}
            >
              Estudante de ADS na FIP, com perfil empreendedor. Crio interfaces
              modernas unindo clareza visual, boas práticas de front-end e visão
              de negócio.
            </p>

            <div
              className="hero-enter mt-10 flex flex-col gap-3 sm:flex-row"
              style={{ "--anim-delay": "0.44s" } as React.CSSProperties}
            >
              <a
                href="#projetos"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-purple-700 px-7 py-3.5 text-sm font-semibold text-white shadow-[0_0_40px_rgba(124,58,237,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_0_60px_rgba(124,58,237,0.55)]"
              >
                Ver projetos
                <svg
                  className="transition-transform group-hover:translate-x-0.5"
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 7.5H12M8.5 3.5L12 7.5L8.5 11.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
              <a
                href="#contato"
                className="inline-flex items-center justify-center rounded-full border border-white/[0.1] bg-white/[0.04] px-7 py-3.5 text-sm font-semibold text-white/70 transition hover:-translate-y-0.5 hover:border-white/[0.18] hover:bg-white/[0.07] hover:text-white/90"
              >
                Entrar em contato
              </a>
            </div>

            <div
              className="hero-enter mt-10 flex flex-wrap gap-2"
              style={{ "--anim-delay": "0.54s" } as React.CSSProperties}
            >
              {["UI Responsiva", "Código Organizado", "Visão Técnica & Comercial"].map(
                (item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/[0.07] bg-white/[0.02] px-4 py-2 text-xs font-medium text-white/30"
                  >
                    {item}
                  </span>
                )
              )}
            </div>
          </div>

          {/* Right – Crachá com física */}
          <div
            className="hero-enter relative mx-auto w-full max-w-sm lg:max-w-none"
            style={{ "--anim-delay": "0.22s" } as React.CSSProperties}
          >
            <PhysicsBadge />
          </div>
        </div>

        {/* Scroll indicator */}
        <div
          className="animate-bounce-slow absolute bottom-6 left-1/2 hidden flex-col items-center gap-1 text-white/20 lg:flex"
          aria-hidden="true"
        >
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
            <path
              d="M10 4V16M5 11L10 16L15 11"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </Container>
    </header>
  );
}
