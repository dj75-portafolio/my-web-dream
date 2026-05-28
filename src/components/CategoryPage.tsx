import { Link } from "@tanstack/react-router";

export function CategoryPage({ title }: { title: string }) {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#000_0%,#1f1f1f_100%)] text-white px-8 py-10">
      <Link
        to="/"
        className="text-sm uppercase tracking-[0.3em] text-white/60 hover:text-white"
      >
        ← Portafolio
      </Link>
      <h1 className="mt-8 text-4xl md:text-6xl font-bold uppercase tracking-[0.2em]">
        {title}
      </h1>
      <div className="mt-3 h-px w-24 bg-white/40" />
      <p className="mt-10 max-w-xl text-white/60">
        Aquí irán los archivos de la carpeta <span className="text-white">{title.toLowerCase()}</span>.
        Sube las imágenes o documentos y los mostraré en esta sección.
      </p>
    </div>
  );
}
