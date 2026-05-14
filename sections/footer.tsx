import { Container } from "@/components/container";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] py-8">
      <Container>
        <div className="flex flex-col gap-4 text-sm text-white/30 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Adriano Da Silva Dantas Junior</p>
          <div className="flex items-center gap-6">
            <span className="font-mono text-xs text-white/20">
              Built with Next.js
            </span>
            <a
              href="#topo"
              className="font-semibold uppercase tracking-widest text-white/40 transition hover:text-white/65"
            >
              ↑ Topo
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
