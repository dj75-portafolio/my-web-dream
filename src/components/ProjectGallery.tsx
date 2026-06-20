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
  const [enlargedIndex, setEnlargedIndex] = useState(0);
  const [isCarouselScrolling, setIsCarouselScrolling] = useState(false);
  const [fichasReady, setFichasReady] = useState<Record<string, boolean>>({});

  const projectsWithFicha = projects
    .map((p) => {
      const imgs = getProjectImages(p.slug);
      return { ...p, ficha: imgs[0], images: imgs };
    })
    .filter((p) => !!p.ficha);

  const project = selectedIndex !== null ? projectsWithFicha[selectedIndex] : null;
  const bigScrollerRef = useRef<HTMLDivElement>(null);
  const smallScrollerRef = useRef<HTMLDivElement>(null);
  const isSnappingRef = useRef(false);
  const isPortraitRef = useRef(isPortrait);

  useEffect(() => {
    isPortraitRef.current = isPortrait;
  }, [isPortrait]);

  const markFichaReady = (src: string) => {
    setFichasReady((prev) => (prev[src] ? prev : { ...prev, [src]: true }));
  };

  // Precargar fichas del carrusel y las primeras imágenes de cada proyecto
  useEffect(() => {
    if (project) return;
    projectsWithFicha.forEach(({ ficha, images }) => {
      [ficha, ...images.slice(1, 4)].forEach((src) => {
        if (fichasReady[src]) return;
        const img = new Image();
        img.onload = () => markFichaReady(src);
        img.onerror = () => markFichaReady(src);
        img.src = src;
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project, projectsWithFicha.length]);

  const getSnapScrollLeft = (container: HTMLElement, index: number) => {
    const items = container.querySelectorAll<HTMLElement>("[data-snap-item]");
    const target = items[index];
    if (!target) return 0;
    return isPortraitRef.current
      ? target.offsetLeft
      : target.offsetLeft + target.offsetWidth / 2 - container.clientWidth / 2;
  };

  const isScrollAtSnap = (container: HTMLElement, index: number) =>
    Math.abs(container.scrollLeft - getSnapScrollLeft(container, index)) < 6;

  const waitForScrollSettle = (container: HTMLElement, index: number, onDone: () => void) => {
    let frames = 0;
    const tick = () => {
      frames += 1;
      if (isScrollAtSnap(container, index) || frames > 40) {
        onDone();
        return;
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const getNearestIndex = (container: HTMLElement) => {
    const items = Array.from(container.querySelectorAll<HTMLElement>("[data-snap-item]"));
    if (items.length === 0) return 0;

    if (isPortraitRef.current) {
      const scroll = container.scrollLeft;
      const viewW = container.clientWidth;
      let bestIdx = 0;
      let bestVisible = -1;
      items.forEach((el, i) => {
        const left = el.offsetLeft;
        const right = left + el.offsetWidth;
        const visible = Math.max(0, Math.min(right, scroll + viewW) - Math.max(left, scroll));
        if (visible > bestVisible) {
          bestVisible = visible;
          bestIdx = i;
        }
      });
      return bestIdx;
    }

    const center = container.scrollLeft + container.clientWidth / 2;
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
    return bestIdx;
  };

  const scrollItemToCenter = (container: HTMLElement, index: number, smooth = true) => {
    container.scrollTo({
      left: getSnapScrollLeft(container, index),
      behavior: smooth ? "smooth" : "auto",
    });
  };

  const snapToNearestCenter = (
    container: HTMLElement,
    setIdx: (i: number) => void,
    smooth = true,
  ) => {
    const idx = getNearestIndex(container);
    setIdx(idx);
    const target = getSnapScrollLeft(container, idx);
    const drift = Math.abs(container.scrollLeft - target);

    const applyEnlarge = () => {
      if (isPortraitRef.current) {
        waitForScrollSettle(container, idx, () => {
          setEnlargedIndex(idx);
          isSnappingRef.current = false;
          setIsCarouselScrolling(false);
        });
      } else {
        setEnlargedIndex(idx);
        isSnappingRef.current = false;
      }
    };

    if (isPortraitRef.current && drift <= 24) {
      applyEnlarge();
      return;
    }

    isSnappingRef.current = true;
    scrollItemToCenter(container, idx, smooth);

    if (isPortraitRef.current) {
      applyEnlarge();
    } else {
      setEnlargedIndex(idx);
      window.setTimeout(() => {
        isSnappingRef.current = false;
      }, smooth ? 450 : 0);
    }
  };

  const scrollByDir = (dir: -1 | 1) => {
    const el = project ? bigScrollerRef.current : smallScrollerRef.current;
    if (!el) return;

    if (!project) {
      const activeIdx = isPortrait
        ? enlargedIndex >= 0
          ? enlargedIndex
          : centeredSmall
        : centeredSmall;
      const next = Math.max(
        0,
        Math.min(el.querySelectorAll("[data-snap-item]").length - 1, activeIdx + dir),
      );
      if (isPortrait) {
        setIsCarouselScrolling(true);
        setEnlargedIndex(-1);
      } else {
        setCenteredSmall(next);
      }
      scrollItemToCenter(el, next);
      return;
    }

    const amount = el.clientWidth * 0.6 * dir;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

  // Detectar item más cercano al centro mientras se hace scroll (efecto imán)
  const trackCenter = (container: HTMLElement | null, setIdx: (i: number) => void) => {
    if (!container) return;
    setIdx(getNearestIndex(container));
  };

  useEffect(() => {
    if (project) return;
    const el = smallScrollerRef.current;
    if (!el) return;

    let snapTimer: ReturnType<typeof setTimeout> | undefined;

    const onScroll = () => {
      if (isSnappingRef.current) return;
      if (isPortraitRef.current) {
        setIsCarouselScrolling(true);
        setEnlargedIndex(-1);
        trackCenter(el, setCenteredSmall);
        clearTimeout(snapTimer);
        snapTimer = setTimeout(() => {
          if (!isSnappingRef.current) snapToNearestCenter(el, setCenteredSmall);
        }, 320);
        return;
      }
      trackCenter(el, setCenteredSmall);
      clearTimeout(snapTimer);
      snapTimer = setTimeout(() => {
        if (!isSnappingRef.current) snapToNearestCenter(el, setCenteredSmall);
      }, 150);
    };

    const onScrollEnd = () => {
      clearTimeout(snapTimer);
      if (isSnappingRef.current) return;
      snapToNearestCenter(el, setCenteredSmall);
    };

    const idx = getNearestIndex(el);
    setCenteredSmall(idx);
    setEnlargedIndex(idx);
    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("scrollend", onScrollEnd);
    return () => {
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("scrollend", onScrollEnd);
      clearTimeout(snapTimer);
    };
  }, [project, isPortrait, projectsWithFicha.length]);

  // Al cambiar orientación, anclar la ficha activa al centro (solo carrusel principal)
  useEffect(() => {
    if (project) return;
    const el = smallScrollerRef.current;
    if (!el) return;
    window.requestAnimationFrame(() => {
      snapToNearestCenter(el, setCenteredSmall, false);
    });
  }, [isPortrait, project]);

  // Detectar orientación (portrait = celular vertical)
  useEffect(() => {
    const mq = window.matchMedia("(orientation: portrait)");
    const update = () => setIsPortrait(mq.matches);
    update();
    mq.addEventListener("change", update);
    window.addEventListener("resize", update);
    return () => {
      mq.removeEventListener("change", update);
      window.removeEventListener("resize", update);
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

  // Al entrar a un proyecto, reiniciar scroll libre desde la primera imagen
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
        el.scrollLeft = isPortraitRef.current
          ? target.offsetLeft
          : target.offsetLeft + target.offsetWidth / 2 - el.clientWidth / 2;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col relative">
      {/* HEADER: título centrado */}
      <header className="px-6 pt-4 pb-2 relative flex items-center justify-center min-h-[3rem]">
        {isPortrait &&
          (project ? (
            <button
              onClick={() => setSelectedIndex(null)}
              aria-label="Volver"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-portafolio hover:text-portafolio-bright text-2xl leading-none transition drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]"
            >
              ←
            </button>
          ) : (
            <Link
              to="/"
              aria-label="Volver"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-50 text-portafolio hover:text-portafolio-bright text-2xl leading-none transition drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]"
            >
              ←
            </Link>
          ))}
        <h1 className="text-xl md:text-2xl font-bold uppercase tracking-[0.2em] text-portafolio whitespace-nowrap">
          {project ? project.name : title}
        </h1>
      </header>

      {/* Flecha volver en horizontal */}
      {!isPortrait &&
        (project ? (
          <button
            onClick={() => setSelectedIndex(null)}
            aria-label="Volver"
            className="fixed z-50 left-3 top-3 text-portafolio hover:text-portafolio-bright text-2xl leading-none transition drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]"
          >
            ←
          </button>
        ) : (
          <Link
            to="/"
            aria-label="Volver"
            className="fixed z-50 left-3 top-3 text-portafolio hover:text-portafolio-bright text-2xl leading-none transition drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]"
          >
            ←
          </Link>
        ))}

      <div className="flex-1 flex items-center relative">
        {/* GALERÍA DE FICHAS: siempre montada para conservar el scroll */}
        <div
          ref={smallScrollerRef}
          data-ficha-scroller
          className={`w-full overflow-x-auto scroll-smooth no-scrollbar ${project ? "hidden" : ""} ${
            isPortrait ? "snap-x snap-proximity" : "snap-x snap-mandatory"
          }`}
          style={{
            WebkitOverflowScrolling: "touch",
            scrollPaddingInline: isPortrait ? "0px" : "50vw",
          }}
        >
          <ul
            className={`ficha-track flex py-8 ${isPortrait ? "gap-0 items-center" : "items-end gap-24 pl-[50vw] pr-[50vw]"}`}
            style={{ minHeight: isPortrait ? undefined : "70vh", width: "max-content" }}
          >
            {projectsWithFicha.map((p, i) => {
              const portraitLocked =
                isPortrait && !isCarouselScrolling && enlargedIndex >= 0;
              const centerReady = fichasReady[p.ficha] ?? false;
              const isCenter = isPortrait
                ? portraitLocked && i === enlargedIndex && centerReady
                : i === centeredSmall;
              const hideNeighbor =
                portraitLocked && i !== enlargedIndex && centerReady;
              const isActiveSlide = isPortrait && i === enlargedIndex;
              return (
                <li
                  key={p.slug}
                  data-snap-item
                  className={`ficha-item shrink-0 flex justify-center${hideNeighbor ? " ficha-item-hidden" : ""}`}
                >
                  <button
                    onClick={() => setSelectedIndex(i)}
                    className="ficha-item-btn block group"
                    aria-label={p.name}
                  >
                    <img
                      src={p.ficha}
                      alt={p.name}
                      loading="eager"
                      decoding="async"
                      fetchPriority={i <= 1 ? "high" : "auto"}
                      onLoad={() => markFichaReady(p.ficha)}
                      className={`ficha-item-img rounded-sm ring-1 ring-white/10 ${
                        isPortrait ? "origin-center" : "origin-bottom"
                      } ${isCenter ? "is-enlarged" : "is-side"}${isActiveSlide && !centerReady ? " ficha-item-loading" : ""}`}
                      draggable={false}
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {project && (
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
                      loading={i < 2 ? "eager" : "lazy"}
                      decoding="async"
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
