import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail, RotateCw } from "lucide-react";
import { useEffect, useState } from "react";
import cvAsset from "@/assets/cv_contacto_v2.png.asset.json";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.37 5.08L2 22l4.96-1.3A9.954 9.954 0 0012 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm4.64 14.3c-.2.56-1.15 1.03-1.6 1.1-.42.06-.97.1-1.56-.1-.36-.11-.82-.26-1.41-.52-2.49-1.05-4.11-3.56-4.23-3.72-.12-.16-1.01-1.34-1.01-2.56 0-1.23.65-1.87.88-2.09.23-.22.5-.28.66-.28.06 0 .12 0 .18.01.14.01.28.01.42.44.2.5.7 1.74.76 1.86.06.13.1.27.02.44-.08.16-.12.27-.25.41-.1.15-.26.33-.37.44-.13.13-.25.26-.11.51.15.25.64 1.06 1.38 1.72.94.84 1.74 1.11 1.99 1.23.24.13.38.11.52-.06.14-.17.62-.72.78-.97.16-.25.32-.21.56-.12.23.08 1.45.68 1.69.8.25.12.42.18.48.28.06.1.06.59-.15 1.17z" />
    </svg>
  );
}

export const Route = createFileRoute("/contacto")({
  head: () => ({ meta: [{ title: "Contacto — Portafolio" }] }),
  component: ContactoPage,
});

function ContactoPage() {
  const [isPortrait, setIsPortrait] = useState(true);

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

  return (
    <div className="min-h-screen w-full bg-[#0d0d0f] flex flex-col relative">
      {/* Flecha volver — arriba, casi al borde izquierdo */}
      <Link
        to="/"
        className="absolute left-2 top-4 z-10 text-sm text-white/40 hover:text-white/80 transition-colors"
        aria-label="Volver a portada"
      >
        ←
      </Link>

      {/* Título */}
      <div className="pt-5 pb-2 px-4 text-center">
        <h1 className="text-[16px] leading-none uppercase tracking-[0.5em] text-white/85">
          CONTACTO
        </h1>
      </div>

      {/* Aviso de girar celular: debajo de CONTACTO y antes del PDF */}
      {isPortrait && (
        <div className="pointer-events-none flex flex-col items-center gap-1 animate-fade-in z-20 pb-4">
          <RotateCw className="h-7 w-7 text-white animate-spin-slow" />
          <span className="text-[12px] uppercase text-white/75">
            Girar celular
          </span>
        </div>
      )}

      {/* Imagen CV — más ancho en horizontal */}
      <div className="flex items-start justify-center px-2 sm:px-4">
        <img
          src={cvAsset.url}
          alt="CV Daniel Jaimes"
          className={`h-auto select-none w-full ${isPortrait ? "max-w-[420px]" : "max-w-none"}`}
          draggable={false}
        />
      </div>


      {/* Espacio inferior con iconos */}
      <div className="flex-1 flex items-center justify-center relative px-4 pb-8 pt-6">
        {/* Iconos centrados y grandes */}
        <div className="flex items-center gap-10">
          <a
            href="https://wa.me/8145942524"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/50 hover:text-white/90 transition-colors"
            aria-label="WhatsApp"
          >
            <WhatsAppIcon className="w-10 h-10" />
          </a>
          <a
            href="mailto:dajaimes75@gmail.com"
            className="text-white/50 hover:text-white/90 transition-colors"
            aria-label="Correo electrónico"
          >
            <Mail className="w-10 h-10" />
          </a>
        </div>
      </div>
    </div>
  );
}
