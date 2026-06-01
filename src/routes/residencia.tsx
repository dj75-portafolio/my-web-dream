import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { RotateCw } from "lucide-react";
import { residenciaProjects, getProjectImages } from "@/lib/residencia";

export const Route = createFileRoute("/residencia")({
  head: () => ({ meta: [{ title: "Residencial — Portafolio" }] }),
  component: ResidenciaIndex,
});

// Ficha (primera imagen) de cada proyecto
const projectsWithFicha = residenciaProjects
  .map((p) => {
    const imgs = getProjectImages(p.slug);
    return { ...p, ficha: imgs[0], images: imgs };
  })
  .filter((p) => !!p.ficha);

function ResidenciaIndex() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);

  const project = selectedIndex !== null ? projectsWithFicha[selectedIndex] : null;
  const bigScrollerRef = useRef<HTMLUListElement>(null);

  // Al abrir un proyecto, mostrar el hint "girar celular" por unos segundos
  useEffect(() => {
    if (project) {
      setShowHint(true);
      const t = setTimeout(() => setShowHint(false), 3500);
      return () => clearTimeout(t);
    }
  }, [project]);

  // Centrar la ficha seleccionada al abrir
  useEffect(() => {
    if (project && bigScrollerRef.current) {
      const el = bigScrollerRef.current.querySelector<HTMLElement>("[data-active='true']");
      el?.scrollIntoView({ behavior: "instant" as ScrollBehavior, inline: "center", block: "nearest" });
    }
  }, [project, selectedIndex]);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#000_0%,#1f1f1f_100%)] text-white flex flex-col">
      <header className="px-6 pt-8 pb-4 flex items-center justify-between">
        {project ? (
          <button
            onClick={() => setSelectedIndex(null)}
            className="text-xs uppercase tracking-[0.3em] text-white/60 hover:text-white"
          >
            ← Proyectos
          </button>
        ) : (
          <Link to="/" className="text-xs uppercase tracking-[0.3em] text-white/60 hover:text-white">
            ← Portafolio
          </Link>
        )}
        <h1 className="text-sm uppercase tracking-[0.4em] text-white/80">
          {project ? project.name : "Residencial"}
        </h1>
        <span className="w-16" />
      </header>

      <div className="flex-1 flex items-center relative">
        {!project ? (
          // ——— GALERÍA DE FICHAS (thumbnails) ———
          <div
            className="w-full overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            <ul className="flex items-center gap-5 px-[35vw] py-8">
              {projectsWithFicha.map((p, i) => (
                <li key={p.slug} className="snap-center shrink-0">
                  <button
                    onClick={() => setSelectedIndex(i)}
                    className="block group"
                    aria-label={p.name}
                  >
                    <img
                      src={p.ficha}
                      alt={p.name}
                      className="block h-[42vh] max-h-[420px] w-auto rounded-sm shadow-2xl ring-1 ring-white/10 transition-transform duration-300 group-hover:scale-[1.03]"
                      draggable={false}
                    />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          // ——— VISTA AMPLIADA CON FICHAS VECINAS VISIBLES ———
          <>
            <ul
              ref={bigScrollerRef}
              className="w-full flex items-center gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar py-6"
              style={{ WebkitOverflowScrolling: "touch" }}
            >
              {projectsWithFicha.map((p, i) => {
                const isActive = i === selectedIndex;
                return (
                  <li
                    key={p.slug}
                    data-active={isActive}
                    className={`snap-center shrink-0 ${i === 0 ? "ml-[15vw]" : ""} ${
                      i === projectsWithFicha.length - 1 ? "mr-[15vw]" : ""
                    }`}
                  >
                    <Link
                      to="/residencia/$project"
                      params={{ project: p.slug }}
                      className="block"
                    >
                      <img
                        src={p.ficha}
                        alt={p.name}
                        onClick={(e) => {
                          if (!isActive) {
                            e.preventDefault();
                            setSelectedIndex(i);
                          }
                        }}
                        className={`block w-auto rounded-sm shadow-2xl transition-all duration-300 ${
                          isActive
                            ? "max-h-[75vh] ring-2 ring-white/40"
                            : "max-h-[45vh] opacity-50 ring-1 ring-white/10"
                        }`}
                        draggable={false}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Hint: girar celular */}
            {showHint && (
              <div className="pointer-events-none absolute inset-x-0 top-4 flex justify-center animate-fade-in">
                <div className="flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-4 py-2 ring-1 ring-white/20">
                  <RotateCw className="h-4 w-4 text-white animate-spin-slow" />
                  <span className="text-[10px] uppercase tracking-[0.25em] text-white/90">
                    Girar celular
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <p className="px-6 pb-8 text-center text-[10px] uppercase tracking-[0.3em] text-white/40">
        {project
          ? "Desliza ← →  ·  Toca la ficha para ver el proyecto"
          : "Desliza ← → y toca una ficha"}
      </p>
    </div>
  );
}
