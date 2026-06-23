import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getProject, loadProjectImages } from "@/lib/residencia";

export const Route = createFileRoute("/residencia/$project")({
  head: ({ params }) => ({
    meta: [{ title: `${getProject(params.project)?.name ?? "Proyecto"} — Residencial` }],
  }),
  component: ProjectPage,
  notFoundComponent: () => (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      Proyecto no encontrado
    </div>
  ),
});

function ProjectPage() {
  const { project } = Route.useParams();
  const data = getProject(project);
  if (!data) throw notFound();

  const [images, setImages] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(2);

  useEffect(() => {
    let cancelled = false;
    loadProjectImages(project).then((loaded) => {
      if (!cancelled) setImages(loaded);
    });
    return () => {
      cancelled = true;
    };
  }, [project]);

  useEffect(() => {
    if (images.length <= visibleCount) return;
    const id = window.setTimeout(() => {
      setVisibleCount((count) => Math.min(images.length, count + 2));
    }, 120);
    return () => window.clearTimeout(id);
  }, [images.length, visibleCount]);

  const visibleImages = images.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#000_0%,#1f1f1f_100%)] text-white flex flex-col">
      <header className="px-6 pt-8 pb-4 flex items-center justify-between">
        <Link
          to="/residencia"
          className="text-xs uppercase tracking-[0.3em] text-white/60 hover:text-white"
        >
          ← Residencial
        </Link>
        <h1 className="text-sm uppercase tracking-[0.4em] text-white/80">{data.name}</h1>
        <span className="w-16" />
      </header>

      <div className="flex-1 flex items-center">
        {images.length === 0 ? (
          <p className="w-full text-center text-white/50 text-sm uppercase tracking-[0.3em] px-6">
            Cargando imágenes…
          </p>
        ) : (
          <div
            className="w-full overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            <ul className="flex items-center gap-6 px-6 py-6">
              {visibleImages.map((src, i) => (
                <li key={src} className="snap-center shrink-0">
                  <img
                    src={src}
                    alt={`${data.name} ${i === 0 ? "ficha" : i}`}
                    loading={i < 2 ? "eager" : "lazy"}
                    decoding="async"
                    className="block max-h-[75vh] w-auto select-none rounded-sm shadow-2xl"
                    draggable={false}
                  />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <p className="px-6 pb-8 text-center text-[10px] uppercase tracking-[0.3em] text-white/40">
        {images.length > 0 ? `Desliza ← →  · ${images.length} imágenes` : ""}
      </p>
    </div>
  );
}
