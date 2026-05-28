import { createFileRoute, Link } from "@tanstack/react-router";
import { residenciaProjects } from "@/lib/residencia";

export const Route = createFileRoute("/residencia")({
  head: () => ({ meta: [{ title: "Residencial — Portafolio" }] }),
  component: ResidenciaIndex,
});

function ResidenciaIndex() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#000_0%,#1f1f1f_100%)] text-white flex flex-col">
      <header className="px-6 pt-8 pb-4 flex items-center justify-between">
        <Link to="/" className="text-xs uppercase tracking-[0.3em] text-white/60 hover:text-white">
          ← Portafolio
        </Link>
        <h1 className="text-sm uppercase tracking-[0.4em] text-white/80">Residencial</h1>
        <span className="w-16" />
      </header>

      <div className="flex-1 flex items-center">
        {/* Carrusel horizontal con scroll-snap, deslizable con el dedo */}
        <div
          className="w-full overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <ul className="flex items-center gap-8 px-[50vw] py-10">
            {residenciaProjects.map((p) => (
              <li key={p.slug} className="snap-center shrink-0">
                <Link
                  to="/residencia/$project"
                  params={{ project: p.slug }}
                  className="block text-center whitespace-nowrap text-2xl md:text-4xl font-light uppercase tracking-[0.25em] text-white/70 hover:text-white transition-colors"
                >
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="px-6 pb-8 text-center text-[10px] uppercase tracking-[0.3em] text-white/40">
        Desliza ← → y toca un proyecto
      </p>
    </div>
  );
}
