import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Portafolio" },
      { name: "description", content: "Portafolio de proyectos: residencial, comercial e industrial." },
    ],
  }),
  component: Index,
});

const sections = [
  { label: "Residencia", to: "/residencia" as const },
  { label: "Comercial", to: "/comercial" as const },
  { label: "Industrial", to: "/industrial" as const },
  { label: "Contacto", to: "/contacto" as const },
];

function Index() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[linear-gradient(180deg,#000_0%,#1f1f1f_100%)] text-white">
      {/* Marca de agua vertical */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center select-none"
      >
        <span
          className="font-black tracking-[0.15em] text-white/[0.04] uppercase"
          style={{
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
            fontSize: "clamp(8rem, 22vw, 22rem)",
            lineHeight: 1,
          }}
        >
          Portafolio
        </span>
      </div>

      {/* Encabezado */}
      <header className="relative z-10 px-8 pt-10">
        <h1 className="text-3xl md:text-5xl font-bold tracking-[0.3em] uppercase">
          Portafolio
        </h1>
        <div className="mt-3 h-px w-24 bg-white/40" />
      </header>

      {/* Botones */}
      <main className="relative z-10 flex min-h-[calc(100vh-10rem)] items-center px-8">
        <nav className="flex w-full max-w-md flex-col gap-5">
          {sections.map((s) => (
            <Link
              key={s.to}
              to={s.to}
              className="group flex items-center justify-between rounded-md border border-white/15 bg-white/[0.03] px-6 py-4 text-lg font-medium uppercase tracking-[0.25em] text-white/90 backdrop-blur-sm transition-all hover:border-white/60 hover:bg-white/10 hover:tracking-[0.35em]"
            >
              <span>{s.label}</span>
              <span className="text-white/40 transition-transform group-hover:translate-x-1 group-hover:text-white">
                →
              </span>
            </Link>
          ))}
        </nav>
      </main>
    </div>
  );
}
