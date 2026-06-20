import { Link } from "@tanstack/react-router";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { RotateCw } from "lucide-react";

export type Project = {
  slug: string;
  name: string;
};

type Props = {
  title: string;
  projects: Project[];
  getProjectImages: (slug: string) => string[];
};

export default function ProjectGallery({ title, projects, getProjectImages }: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(true);
  const [isPortrait, setIsPortrait] = useState(true);
  const [centeredSmall, setCenteredSmall] = useState(0);
  const [centeredBig, setCenteredBig] = useState(0);

  const projectsWithFicha = projects
    .map((p) => {
      const imgs = getProjectImages(p.slug);
      return { ...p, ficha: imgs[0], images: imgs };
    })
    .filter((p) => !!p.ficha);

  const project = selectedIndex !== null ? projectsWithFicha[selectedIndex] : null;
  const bigScrollerRef = useRef<HTMLDivElement>(null);
  const smallScrollerRef = useRef<HTMLDivElement>(null);

  const scrollByDir = (dir: -1 | 1) => {
    const el = project ? bigScrollerRef.current : smallScrollerRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.6 * dir;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  // Detectar item más cercano al centro mientras se hace scroll (efecto imán)
  const trackCenter = (container: HTMLElement | null, setIdx: (i: number) => void) => {
    if (!container) return;
    const center = container.scrollLeft + container.clientWidth / 2;
    const items = Array.from(container.querySelectorAll<HTMLElement>("[data-snap-item]"));
    let bestIdx = 0;
    let bestDist = Infinity;
    items.forEach((el, i) => {
      const mid = el.offsetLeft + el.offsetWidth / 2;
      const d = Math.abs(mid - center);
      if (d < bestDist) {
        bestDist = d;
        bestIdx = i;
      }
    });
    setIdx(bestIdx);
  };

  useEffect(() => {
    const el = project ? bigScrollerRef.current : smallScrollerRef.current;
    if (!el) return;
    const setter = project ? setCenteredBig : setCenteredSmall;
    const onScroll = () => trackCenter(el, setter);
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [project, isPortrait, projectsWithFicha.length]);

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

  // Al volver al carrusel de proyectos, centrar el proyecto recién visitado
  // useLayoutEffect evita el "flash" en el que se ve primero la primera ficha
  useLayoutEffect(() => {
    if (!project && smallScrollerRef.current) {
      const el = smallScrollerRef.current;
      const items = el.querySelectorAll<HTMLElement>("[data-snap-item]");
      const target = items[centeredSmall];
      if (target) {
        el.scrollLeft = target.offsetLeft + target.offsetWidth / 2 - el.clientWidth / 2;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col relative">
      {/* HEADER: título centrado */}
      <header className="px-6 pt-4 pb-2 relative flex items-center justify-center">
        <h1 className="text-xl md:text-2xl font-bold uppercase tracking-[0.2em] text-portafolio whitespace-nowrap">
          {project ? project.name : title}
        </h1>
      </header>

      {/* Flecha volver: posición según orientación */}
      {project ? (
        <button
          onClick={() => setSelectedIndex(null)}
          aria-label="Volver"
          className={`fixed z-50 text-portafolio hover:text-portafolio-bright text-2xl leading-none transition drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] ${isPortrait ? "left-6 top-[120px]" : "left-3 top-3"}`}
        >
          ←
        </button>
      ) : (
        <Link
          to="/"
          aria-label="Volver"
          className={`fixed z-50 text-portafolio hover:text-portafolio-bright text-2xl leading-none transition drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] ${isPortrait ? "left-6 top-[120px]" : "left-3 top-3"}`}
        >
          ←
        </Link>
      )}

      <div className="flex-1 flex items-center relative">
        {/* GALERÍA DE FICHAS: siempre montada para conservar el scroll */}
        <div
          ref={smallScrollerRef}
          className={`w-full overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar ${project ? "hidden" : ""}`}
          style={{ WebkitOverflowScrolling: "touch", scrollPaddingInline: "50vw" }}
        >
          <ul className="flex items-end gap-24 pl-[50vw] pr-[50vw] py-8" style={{ minHeight: "70vh", width: "max-content" }}>
            {projectsWithFicha.map((p, i) => {
              const isCenter = !isPortrait && i === centeredSmall;
              return (
                <li key={p.slug} data-snap-item className="snap-center shrink-0">
                  <button
                    onClick={() => setSelectedIndex(i)}
                    className="block group"
                    aria-label={p.name}
                  >
                    <img
                      src={p.ficha}
                      alt={p.name}
                      className={`block h-[42vh] max-h-[420px] w-auto rounded-sm shadow-2xl ring-1 ring-white/10 transition-all duration-300 origin-bottom ${isCenter ? "scale-150" : "opacity-70"}`}
                      draggable={false}
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {project && (
          // ——— IMÁGENES DENTRO DEL PROYECTO: todas iguales, sin imán ———
          <div
            ref={bigScrollerRef}
            className="w-full overflow-x-auto no-scrollbar"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            <ul className="flex items-center gap-6 py-6 px-[10vw]" style={{ minHeight: "85vh" }}>
              {project.images.map((src, i) => {
                const isFicha = i === 0;
                return (
                  <li key={src} className="shrink-0">
                    <img
                      src={src}
                      alt={`${project.name} ${isFicha ? "ficha" : i}`}
                      onClick={isFicha ? () => setSelectedIndex(null) : undefined}
                      className={`block h-[70vh] w-auto rounded-sm shadow-2xl ring-1 ring-white/15 ${isFicha ? "cursor-pointer" : ""}`}
                      draggable={false}
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>


      {/* HINT: girar celular */}
      {!project && showHint && isPortrait && (
        <div
          className="pointer-events-none absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-fade-in z-20"
          style={{ top: "calc(env(safe-area-inset-top, 0px) + 100px)" }}
        >
          <RotateCw className="h-6 w-6 text-portafolio animate-spin-slow" />
          <span className="text-[11px] uppercase tracking-[0.25em] text-portafolio">
            Girar celular
          </span>
        </div>
      )}

      {/* FOOTER: flechas sin marco */}
      <div className="px-6 pb-12 pt-2 text-center flex justify-center">
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={() => scrollByDir(-1)}
            aria-label="Anterior"
            className="text-portafolio hover:text-portafolio-bright text-xl leading-none transition"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => scrollByDir(1)}
            aria-label="Siguiente"
            className="text-portafolio hover:text-portafolio-bright text-xl leading-none transition"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
