import { Container } from "@/components/container";

export function Footer() {
  return (
    <footer className="pb-8 pt-4">
      <Container>
        <div className="surface-panel rounded-full px-6 py-4">
          <div className="flex flex-col gap-3 text-center text-sm text-[color:var(--muted)] sm:flex-row sm:items-center sm:justify-between sm:text-left">
            <p>© 2026 Adriano Da Silva Dantas Junior. Todos os direitos reservados.</p>
            <a
              href="#topo"
              className="font-bold uppercase tracking-[0.18em] text-violet-900 transition hover:text-violet-700"
            >
              Voltar ao topo
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
}
