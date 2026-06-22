import { Link } from "@tanstack/react-router";
import { Mail, RotateCw } from "lucide-react";
import { useEffect, useState } from "react";
import TypewriterText from "@/components/TypewriterText";
import { getCvImageUrl } from "@/lib/cv";

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

function BackToPortafolioLink({ className }: { className: string }) {
  return (
    <Link
      to="/"
      aria-label="Volver a portada"
      className={`flex items-center gap-1.5 text-portafolio hover:text-portafolio-bright transition drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] ${className}`}
    >
      <span className="text-2xl leading-none">{"\u2190"}</span>
      <span className="text-[10px] uppercase tracking-[0.2em] leading-none">
        Portafolio
      </span>
    </Link>
  );
}

export default function CvContactView() {
  const [isPortrait, setIsPortrait] = useState(true);
  const cvImage = getCvImageUrl();

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
    <div className="min-h-[100dvh] w-full bg-black flex flex-col relative">
      <header className="shrink-0 px-6 pt-5 pb-2">
        <h1 className="text-[16px] leading-none uppercase tracking-[0.5em] text-portafolio text-center">
          <TypewriterText text="CONTACTO" />
        </h1>
      </header>

      <div className="shrink-0 pl-4 pt-1 pb-3 min-h-[2.25rem]">
        <BackToPortafolioLink className="relative z-50" />
      </div>

      {isPortrait ? (
        <div className="relative flex-1 flex flex-col justify-end pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          <div className="pointer-events-none flex flex-col items-center gap-1 animate-fade-in pt-2 mb-8">
            <RotateCw className="h-7 w-7 text-portafolio animate-spin-slow" />
            <span className="text-[12px] uppercase text-portafolio">
              Girar celular
            </span>
          </div>

          <div className="flex items-start justify-start w-full">
            <img
              src={cvImage}
              alt="CV Daniel Jaimes"
              loading="eager"
              decoding="async"
              className="h-auto select-none w-full max-w-none block"
              draggable={false}
            />
          </div>

          <div className="flex items-center justify-center gap-10 pt-4 pb-1">
            <a
              href="https://wa.me/8145942524"
              target="_blank"
              rel="noopener noreferrer"
              className="text-portafolio hover:text-portafolio-bright transition-colors"
              aria-label="WhatsApp"
            >
              <WhatsAppIcon className="w-10 h-10" />
            </a>
            <a
              href="mailto:dajaimes75@gmail.com"
              className="text-portafolio hover:text-portafolio-bright transition-colors"
              aria-label="Correo electrónico"
            >
              <Mail className="w-10 h-10" />
            </a>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-stretch w-full pb-8">
            <div className="flex items-start justify-start w-full">
              <img
                src={cvImage}
                alt="CV Daniel Jaimes"
                loading="eager"
                decoding="async"
                className="h-auto select-none w-full max-w-none block"
                draggable={false}
              />
            </div>

            <div className="flex items-center gap-10 pt-6">
              <a
                href="https://wa.me/8145942524"
                target="_blank"
                rel="noopener noreferrer"
                className="text-portafolio hover:text-portafolio-bright transition-colors"
                aria-label="WhatsApp"
              >
                <WhatsAppIcon className="w-10 h-10" />
              </a>
              <a
                href="mailto:dajaimes75@gmail.com"
                className="text-portafolio hover:text-portafolio-bright transition-colors"
                aria-label="Correo electrónico"
              >
                <Mail className="w-10 h-10" />
              </a>
            </div>
          </div>
      )}
    </div>
  );
}
