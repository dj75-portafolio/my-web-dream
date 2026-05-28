import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getProject, getProjectImages } from "@/lib/residencia";

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

  const images = getProjectImages(project);

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
            Sube las imágenes .webp a
            <br />
            <code className="text-white/80 normal-case tracking-normal">
              src/assets/residencia/{project}/
            </code>
            <br />
            (el archivo que empiece con "ficha" aparecerá primero)
          </p>
        ) : (
          <div
            className="w-full overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            <ul className="flex items-center gap-6 px-6 py-6">
              {images.map((src, i) => (
                <li key={src} className="snap-center shrink-0">
                  <img
                    src={src}
                    alt={`${data.name} ${i === 0 ? "ficha" : i}`}
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
