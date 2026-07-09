import { Link } from "@tanstack/react-router";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Pointer, RotateCw } from "lucide-react";
import TypewriterText from "@/components/TypewriterText";

export type Project = {
  slug: string;
  name: string;
};

function portraitTitleSizeClass(name: string) {
  if (name.length >= 26) {
    return "text-[13px] tracking-[0.07em] leading-tight whitespace-normal";
  }
  if (name.length >= 22) {
    return "text-sm tracking-[0.09em] leading-snug";
  }
  if (name.length >= 18) {
    return "text-base tracking-[0.11em] leading-snug";
  }
  return "text-lg tracking-[0.14em] whitespace-nowrap";
}

type Props = {
  title: string;
  projects: Project[];
  getFichaUrl: (slug: string) => string | undefined;
  loadProjectImages: (slug: string) => Promise<string[]>;
};

export default function ProjectGallery({
  title,
  projects,
  getFichaUrl,
  loadProjectImages,
}: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(true);
  const [isPortrait, setIsPortrait] = useState(true);
  const [centeredSmall, setCenteredSmall] = useState(0);
  const [projectImages, setProjectImages] = useState<string[]>([]);
  const [projectImagesLoading, setProjectImagesLoading] = useState(false);
  const [centerHasGallery, setCenterHasGallery] = useState(false);

  const projectsWithFicha = projects
    .map((p) => ({ ...p, ficha: getFichaUrl(p.slug) }))
    .filter((p): p is Project & { ficha: string } => !!p.ficha);

  const project = selectedIndex !== null ? projectsWithFicha[selectedIndex] : null;
  const centeredProject = projectsWithFicha[centeredSmall];
  const showClickHint =
    !project && centeredProject !== undefined && centerHasGallery;
  const bigScrollerRef = useRef<HTMLDivElement>(null);
  const smallScrollerRef = useRef<HTMLDivElement>(null);
  const carouselAreaRef = useRef<HTMLDivElement>(null);
  const isSnappingRef = useRef(false);
  const [landscapeHintPos, setLandscapeHintPos] = useState<{ left: number; top: number } | null>(
    null,
  );

  useEffect(() => {
    if (project) return;
    [centeredSmall - 1, centeredSmall, centeredSmall + 1]
      .filter((i) => i >= 0 && i < projectsWithFicha.length)
      .forEach((i) => {
        const img = new Image();
        img.src = projectsWithFicha[i].ficha;
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project, centeredSmall, projectsWithFicha.length]);

  useEffect(() => {
    if (project) return;
    const slug = projectsWithFicha[centeredSmall]?.slug;
    if (!slug) {
      setCenterHasGallery(false);
      return;
    }
    let cancelled = false;
    loadProjectImages(slug).then((images) => {
      if (!cancelled) setCenterHasGallery(images.length > 1);
    });
    return () => {
      cancelled = true;
    };
  }, [project, centeredSmall, loadProjectImages, projectsWithFicha]);

  useEffect(() => {
    if (selectedIndex === null) {
      setProjectImages([]);
      setProjectImagesLoading(false);
      return;
    }

    const slug = projectsWithFicha[selectedIndex]?.slug;
    if (!slug) return;

    let cancelled = false;
    setProjectImagesLoading(true);
    setProjectImages([]);

    loadProjectImages(slug).then((images) => {
      if (cancelled) return;
      setProjectImages(images);
      setProjectImagesLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [selectedIndex, loadProjectImages, projectsWithFicha]);

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

  const updateClickHintPosition = useCallback(() => {
    if (!showClickHint || isPortrait) {
      setLandscapeHintPos(null);
      return;
    }

    const area = carouselAreaRef.current;
    const scroller = smallScrollerRef.current;
    if (!area || !scroller) return;

    const items = scroller.querySelectorAll<HTMLElement>("[data-snap-item]");
    const item = items[centeredSmall];
    if (!item) return;

    const img = item.querySelector<HTMLElement>(".ficha-item-img");
    if (!img) return;

    const areaRect = area.getBoundingClientRect();
    const imgRect = img.getBoundingClientRect();

    setLandscapeHintPos({
      left: imgRect.left - areaRect.left - 38,
      top: imgRect.top - areaRect.top + 8,
    });
  }, [showClickHint, isPortrait, centeredSmall]);

  useLayoutEffect(() => {
    const id = requestAnimationFrame(updateClickHintPosition);
    return () => cancelAnimationFrame(id);
  }, [updateClickHintPosition]);

  useEffect(() => {
    if (!showClickHint || isPortrait) return;

    window.addEventListener("resize", updateClickHintPosition);
    const scroller = smallScrollerRef.current;
    scroller?.addEventListener("scroll", updateClickHintPosition, { passive: true });

    const item = scroller?.querySelectorAll<HTMLElement>("[data-snap-item]")[centeredSmall];
    const img = item?.querySelector<HTMLImageElement>(".ficha-item-img");
    const onLoad = () => updateClickHintPosition();
    img?.addEventListener("load", onLoad);
    if (img?.complete) onLoad();

    return () => {
      window.removeEventListener("resize", updateClickHintPosition);
      scroller?.removeEventListener("scroll", updateClickHintPosition);
      img?.removeEventListener("load", onLoad);
    };
  }, [showClickHint, isPortrait, centeredSmall, updateClickHintPosition]);

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

  const arrowClass =
    "text-portafolio hover:text-portafolio-bright text-2xl leading-none transition drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]";

  const titleText = project ? project.name : title;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col relative">
      {isPortrait ? (
        <header className="relative z-50 shrink-0 bg-black grid grid-cols-[2.75rem_1fr] items-center gap-x-2 px-3 pt-4 pb-2 min-h-[3rem]">
          <div className="flex items-center justify-center">
            {project ? (
              <button
                onClick={() => setSelectedIndex(null)}
                aria-label="Volver"
                className={arrowClass}
              >
                {"\u2190"}
              </button>
            ) : (
              <Link to="/" aria-label="Volver" className={arrowClass}>
                {"\u2190"}
              </Link>
            )}
          </div>
          <h1
            className={`min-w-0 text-center font-bold uppercase text-portafolio ${
              project
                ? portraitTitleSizeClass(project.name)
                : "text-xl tracking-[0.2em] whitespace-nowrap"
            }`}
          >
            {project ? titleText : <TypewriterText text={title.toUpperCase()} />}
          </h1>
        </header>
      ) : (
        <header className="relative z-50 shrink-0 bg-black px-6 pt-4 pb-2 flex items-center justify-center min-h-[3rem]">
          <h1 className="text-xl md:text-2xl font-bold uppercase tracking-[0.2em] text-portafolio whitespace-nowrap">
            {project ? titleText : <TypewriterText text={title.toUpperCase()} />}
          </h1>
        </header>
      )}

      {!isPortrait &&
        (project ? (
          <button
            onClick={() => setSelectedIndex(null)}
            aria-label="Volver"
            className="fixed z-50 left-3 top-3 text-portafolio hover:text-portafolio-bright text-2xl leading-none transition drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]"
          >
            {"\u2190"}
          </button>
        ) : (
          <Link
            to="/"
            aria-label="Volver"
            className="fixed z-50 left-3 top-3 text-portafolio hover:text-portafolio-bright text-2xl leading-none transition drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]"
          >
            {"\u2190"}
          </Link>
        ))}

      <div
        ref={carouselAreaRef}
        className={`flex-1 flex relative ${!project && isPortrait ? "items-start" : "items-center"}`}
      >
        <div
          ref={smallScrollerRef}
          data-ficha-scroller
          className={`w-full overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar ${project ? "hidden" : ""}`}
          style={{ WebkitOverflowScrolling: "touch", scrollPaddingInline: "50vw" }}
        >
          <ul
            className="ficha-track flex items-end gap-24 py-8 pl-[50vw] pr-[50vw]"
            style={{
              minHeight: !project && isPortrait ? "54vh" : "70vh",
              width: "max-content",
            }}
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
                      loading={isCenter ? "eager" : "lazy"}
                      decoding="async"
                      className={`ficha-item-img rounded-sm ring-1 ring-white/10 origin-bottom ${
                        isCenter ? "is-enlarged" : "is-side"
                      }${p.slug === "proyecto-zolino" ? " ficha-item-img--zolino" : ""}`}
                      draggable={false}
                    />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {showClickHint && (
          <div
            data-ficha-click-hint
            className={`pointer-events-none absolute z-30 flex flex-col gap-0.5 animate-fade-in ${
              isPortrait ? "items-center" : "items-start"
            }`}
            style={
              !isPortrait && landscapeHintPos
                ? { left: landscapeHintPos.left, top: landscapeHintPos.top }
                : undefined
            }
            aria-hidden="true"
          >
            <Pointer className="ficha-click-hint-icon h-5 w-5 text-portafolio drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]" />
            <span className="text-[9px] uppercase tracking-[0.2em] text-portafolio leading-none">
              click
            </span>
          </div>
        )}

        {project && (
          <div
            ref={bigScrollerRef}
            data-project-scroller
            className="w-full overflow-x-auto no-scrollbar"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {projectImagesLoading && projectImages.length === 0 ? (
              <p className="w-full py-24 text-center text-sm uppercase tracking-[0.25em] text-white/50">
                Cargando imágenes…
              </p>
            ) : (
              <ul className="flex items-center gap-6 py-6 px-[6vw]" style={{ minHeight: "90vh" }}>
                {projectImages.map((src, i) => {
                  const isFicha = i === 0;
                  const label =
                    src
                      .split("/")
                      .pop()
                      ?.replace(/\.[^.]+$/, "")
                      .replace(/-/g, " ") ?? String(i);
                  return (
                    <li key={`${src}-${i}`} className="shrink-0">
                      <img
                        src={src}
                        alt={isFicha ? `${project.name} ficha` : `${project.name} ${label}`}
                        loading="eager"
                        decoding="async"
                        onClick={isFicha ? () => setSelectedIndex(null) : undefined}
                        className={`project-gallery-img block rounded-sm shadow-2xl ring-1 ring-white/15 ${isFicha ? "cursor-pointer" : ""}`}
                        draggable={false}
                      />
                    </li>
                  );
                })}
              </ul>
            )}
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

      <div className={`px-6 pt-2 text-center flex justify-center ${isPortrait ? "pb-16" : "pb-12"}`}>
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={() => scrollByDir(-1)}
            aria-label="Anterior"
            className="text-portafolio hover:text-portafolio-bright text-xl leading-none transition"
          >
            {"\u2190"}
          </button>
          <button
            type="button"
            onClick={() => scrollByDir(1)}
            aria-label="Siguiente"
            className="text-portafolio hover:text-portafolio-bright text-xl leading-none transition"
          >
            {"\u2192"}
          </button>
        </div>
      </div>
    </div>
  );
}
