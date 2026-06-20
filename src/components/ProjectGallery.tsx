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

  // Precargar fichas al entrar
  useEffect(() => {
    if (project) return;
    projectsWithFicha.forEach(({ ficha }) => {
      const img = new Image();
      img.src = ficha;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project, projectsWithFicha.length]);

  const getNearestIndex = (container: HTMLElement) => {
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
    return bestIdx;
  };

  const scrollItemToCenter = (container: HTMLElement, index: number, smooth = true) => {
    const items = container.querySelectorAll<HTMLElement>("[data-snap-item]");
    const target = items[index];
    if (!target) return;
    const left = target.offsetLeft + target.offsetWidth / 2 - container.clientWidth / 2;
    container.scrollTo({ left, behavior: smooth ? "smooth" : "auto" });
  };

  const snapToNearestCenter = (
    container: HTMLElement,
    setIdx: (i: number) => void,
    smooth = true,
  ) => {
    const idx = getNearestIndex(container);
    setIdx(idx);
    isSnappingRef.current = true;
    scrollItemToCenter(container, idx, smooth);
    window.setTimeout(() => {
      isSnappingRef.current = false;
    }, smooth ? 450 : 0);
  };

  const scrollByDir = (dir: -1 | 1) => {
    const el = project ? bigScrollerRef.current : smallScrollerRef.current;
    if (!el) return;

    if (!project) {
      const next = Math.max(
        0,
        Math.min(el.querySelectorAll("[data-snap-item]").length - 1, centeredSmall + dir),
      );
      setCenteredSmall(next);
      scrollItemToCenter(el, next);
      return;
    }

    const amount = el.clientWidth * 0.6 * dir;
    el.scrollBy({ left: amount, behavior: "smooth" });
  };

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
      trackCenter(el, setCenteredSmall);
      clearTimeout(snapTimer);
      snapTimer = setTimeout(() => {
        if (!isSnappingRef.current) snapToNearestCenter(el, setCenteredSmall);
      }, 150);
    };

    const onScrollEnd = () => {
      clearTimeout(snapTimer);
      if (!isSnappingRef.current) snapToNearestCenter(el, setCenteredSmall);
    };

    const idx = getNearestIndex(el);
    setCenteredSmall(idx);
    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("scrollend", onScrollEnd);
    return () => {
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("scrollend", onScrollEnd);
      clearTimeout(snapTimer);
    };
  }, [project, projectsWithFicha.length]);

  useEffect(() => {
    if (project) return;
    const el = smallScrollerRef.current;
    if (!el) return;
    window.requestAnimationFrame(() => {
      snapToNearestCenter(el, setCenteredSmall, false);
    });
  }, [isPortrait, project]);

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

  useEffect(() => {
    if (!isPortrait || project) setShowHint(false);
  }, [isPortrait, project]);

  useEffect(() => {
    if (!showHint) return;
    const t = setTimeout(() => setShowHint(false), 6000);
    return () => clearTimeout(t);
  }, [showHint]);

  useEffect(() => {
    if (project && bigScrollerRef.current) {
      bigScrollerRef.current.scrollLeft = 0;
    }
  }, [project]);

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
        <div
          ref={smallScrollerRef}
          data-ficha-scroller
          className={`w-full overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar ${project ? "hidden" : ""}`}
          style={{ WebkitOverflowScrolling: "touch", scrollPaddingInline: "50vw" }}
        >
          <ul
            className="ficha-track flex items-end gap-24 py-8 pl-[50vw] pr-[50vw]"
            style={{ minHeight: "70vh", width: "max-content" }}
          >
            {projectsWithFicha.map((p, i) => {
              const isCenter = i === centeredSmall;
              return (
                <li key={p.slug} data-snap-item className="ficha-item snap-center shrink-0">
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
                      fetchPriority="high"
                      className={`ficha-item-img rounded-sm ring-1 ring-white/10 origin-bottom ${
                        isCenter ? "is-enlarged" : "is-side"
                      }`}
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
