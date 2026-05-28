import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { residenciaProjects, getProjectImages } from "@/lib/residencia";

export const Route = createFileRoute("/residencia")({
  head: () => ({ meta: [{ title: "Residencial — Portafolio" }] }),
  component: ResidenciaIndex,
});

function ResidenciaIndex() {
  const [selected, setSelected] = useState<string | null>(null);
  const project = selected ? residenciaProjects.find((p) => p.slug === selected) : null;
  const images = selected ? getProjectImages(selected) : [];

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#000_0%,#1f1f1f_100%)] text-white flex flex-col">
      <header className="px-6 pt-8 pb-4 flex items-center justify-between">
        {project ? (
          <button
            onClick={() => setSelected(null)}
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

      <div className="flex-1 flex items-center">
        {!project ? (
          <div
            className="w-full overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            <ul className="flex items-center gap-8 px-[50vw] py-10">
              {residenciaProjects.map((p) => (
                <li key={p.slug} className="snap-center shrink-0">
                  <button
                    onClick={() => setSelected(p.slug)}
                    className="block text-center whitespace-nowrap text-2xl md:text-4xl font-light uppercase tracking-[0.25em] text-white/70 hover:text-white transition-colors"
                  >
                    {p.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : images.length === 0 ? (
          <p className="w-full text-center text-white/50 text-sm uppercase tracking-[0.3em] px-6">
            Sube las imágenes .webp a
            <br />
            <code className="text-white/80 normal-case tracking-normal">
              src/assets/residencia/{selected}/
            </code>
            <br />
            (el archivo que empiece con "ficha" aparecerá primero)
          </p>
        ) : (
          <div
            className="w-full overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            <ul className="flex items-center gap-6 px-[10vw] py-6">
              {images.map((src, i) => (
                <li key={src} className="snap-center shrink-0">
                  <img
                    src={src}
                    alt={`${project.name} ${i === 0 ? "ficha" : i}`}
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
        {project
          ? images.length > 0
            ? `Desliza ← →  · ${images.length} imágenes`
            : ""
          : "Desliza ← → y toca un proyecto"}
      </p>
    </div>
  );
}
