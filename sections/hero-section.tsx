import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/container";

export function HeroSection() {
  return (
    <header id="topo" className="relative pt-6">
      <Container>
        <div className="surface-panel sticky top-4 z-30 rounded-full px-4 py-3 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <Link href="/" className="flex items-center gap-3">
              <span className="font-display inline-flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-violet-700 to-fuchsia-400 text-sm font-bold text-white shadow-[0_14px_28px_rgba(109,63,210,0.32)]">
                AJ
              </span>
              <span className="flex flex-col">
                <strong className="text-sm font-extrabold uppercase tracking-[0.22em] text-slate-900">
                  Adriano JR
                </strong>
                <span className="text-xs text-[color:var(--muted)]">
                  Portfolio em Next.js
                </span>
              </span>
            </Link>

            <nav className="flex flex-wrap items-center gap-2 text-sm font-bold text-[color:var(--muted)]">
              <a className="rounded-full px-4 py-2 transition hover:bg-violet-500/10 hover:text-violet-950" href="#sobre">
                Sobre
              </a>
              <a className="rounded-full px-4 py-2 transition hover:bg-violet-500/10 hover:text-violet-950" href="#projetos">
                Projetos
              </a>
              <a className="rounded-full px-4 py-2 transition hover:bg-violet-500/10 hover:text-violet-950" href="#contato">
                Contato
              </a>
            </nav>
          </div>
        </div>

        <div className="grid min-h-[calc(100vh-7rem)] items-center gap-10 py-10 lg:grid-cols-[1.1fr_0.9fr] lg:py-16">
          <div className="surface-panel gradient-stroke relative overflow-hidden rounded-[2rem] px-6 py-8 sm:px-10 sm:py-12">
            <div className="absolute -right-12 top-0 h-32 w-32 rounded-full bg-violet-400/20 blur-3xl" />
            <div className="absolute bottom-0 left-0 h-28 w-28 rounded-full bg-fuchsia-300/20 blur-3xl" />

            <span className="inline-flex rounded-full bg-violet-500/10 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.24em] text-violet-950">
              Desenvolvedor Web | Empresario
            </span>

            <h1 className="font-display text-balance mt-6 text-5xl font-bold tracking-[-0.07em] text-slate-950 sm:text-6xl lg:text-7xl">
              Adriano Da Silva Dantas Junior
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-[color:var(--muted)] sm:text-xl">
              Estudante de ADS na FIP, com perfil empreendedor e foco em criar
              interfaces modernas, organizadas e com presenca profissional.
              Busco unir clareza visual, boas praticas de front-end e visao de
              negocio em cada projeto.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#projetos"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-violet-700 to-fuchsia-500 px-6 py-4 text-sm font-extrabold uppercase tracking-[0.18em] text-white shadow-[0_18px_35px_rgba(109,63,210,0.28)] transition hover:-translate-y-0.5"
              >
                Ver projetos
              </a>
              <a
                href="#contato"
                className="inline-flex items-center justify-center rounded-full border border-violet-200 bg-white/70 px-6 py-4 text-sm font-extrabold uppercase tracking-[0.18em] text-violet-950 transition hover:-translate-y-0.5 hover:bg-white"
              >
                Contato
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              {["UI responsiva", "Codigo organizado", "Visao tecnica e comercial"].map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-violet-200/80 bg-white/70 px-4 py-2 text-sm font-semibold text-slate-700"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="surface-panel-strong gradient-stroke relative overflow-hidden rounded-[2.25rem] p-4">
              <div className="absolute inset-x-8 top-4 h-20 rounded-full bg-violet-500/10 blur-3xl" />
              <div className="absolute -right-6 bottom-10 h-28 w-28 rounded-full bg-fuchsia-300/25 blur-3xl" />

              <div className="relative overflow-hidden rounded-[1.8rem] border border-white/40 bg-white/70">
                <Image
                  src="/images/foto.jpg"
                  alt="Foto de Adriano Da Silva Dantas Junior"
                  width={900}
                  height={1100}
                  className="aspect-[4/5] w-full object-cover"
                  priority
                />
              </div>

              <div className="surface-panel absolute -bottom-5 left-4 rounded-2xl px-4 py-3 sm:left-6">
                <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-violet-900">
                  Disponivel para novos projetos
                </p>
                <p className="mt-1 text-sm text-[color:var(--muted)]">
                  Front-end moderno com foco em presenca digital.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </header>
  );
}
