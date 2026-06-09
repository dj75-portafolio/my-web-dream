import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { RotateCw } from "lucide-react";
import { residenciaProjects, getProjectImages } from "@/lib/residencia";

export const Route = createFileRoute("/residencia")({
  head: () => ({ meta: [{ title: "Residencial — Portafolio" }] }),
  component: ResidenciaIndex,
});

const projectsWithFicha = residenciaProjects
  .map((p) => {
    const imgs = getProjectImages(p.slug);
    return { ...p, ficha: imgs[0], images: imgs };
  })
  .filter((p) => !!p.ficha);

function ResidenciaIndex() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(true);
  const [isPortrait, setIsPortrait] = useState(true);

  const project = selectedIndex !== null ? projectsWithFicha[selectedIndex] : null;
  const bigScrollerRef = useRef<HTMLUListElement>(null);
  const smallScrollerRef = useRef<HTMLDivElement>(null);

  const scrollByDir = (dir: -1 | 1) => {
    const el = project ? bigScrollerRef.current : smallScrollerRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.6 * dir;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  // Detectar orientación
  useEffect(() => {
    const update = () => setIsPortrait(window.innerHeight >= window.innerWidth);
    update();
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);

  // Ocultar el hint cuando el usuario gira el celular u abre un proyecto
  useEffect(() => {
    if (!isPortrait || project) setShowHint(false);
  }, [isPortrait, project]);

  // Auto-ocultar después de 6 segundos
  useEffect(() => {
    if (!showHint) return;
    const t = setTimeout(() => setShowHint(false), 6000);
    return () => clearTimeout(t);
  }, [showHint]);

  // Al cambiar de proyecto, reiniciar scroll a la primera imagen
  useEffect(() => {
    if (project && bigScrollerRef.current) {
      bigScrollerRef.current.scrollLeft = 0;
    }
  }, [project]);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#000_0%,#1f1f1f_100%)] text-white flex flex-col relative">
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
            ref={smallScrollerRef}
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
          <ul
            ref={bigScrollerRef}
            className="w-full flex items-center gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar py-6 px-[10vw]"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {project.images.map((src, i) => (
              <li key={src} className="snap-center shrink-0">
                <img
                  src={src}
                  alt={`${project.name} ${i === 0 ? "ficha" : i}`}
                  className="block max-h-[72vh] w-auto rounded-sm shadow-2xl ring-1 ring-white/15"
                  draggable={false}
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      {!project && showHint && isPortrait && (
        <div className="pointer-events-none absolute top-20 inset-x-0 flex justify-center animate-fade-in z-20">
          <div className="flex items-center gap-2 rounded-full bg-black/80 px-4 py-2 ring-1 ring-white/30 shadow-xl">
            <RotateCw className="h-4 w-4 text-white animate-spin-slow" />
            <span className="text-[10px] uppercase tracking-[0.25em] text-white">
              Girar celular
            </span>
          </div>
        </div>
      )}

      <div className="px-6 pb-8 text-center flex flex-col items-center gap-2">
        <span className="text-[10px] uppercase tracking-[0.3em] text-white/40">Desliza</span>
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label="Anterior"
            className="text-white/80 hover:text-white text-2xl leading-none px-3 py-1 rounded-full ring-1 ring-white/20 hover:ring-white/50 transition"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label="Siguiente"
            className="text-white/80 hover:text-white text-2xl leading-none px-3 py-1 rounded-full ring-1 ring-white/20 hover:ring-white/50 transition"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
