import { Suspense, lazy } from "react";
import { createFileRoute } from "@tanstack/react-router";
import PortadaSignature from "@/components/PortadaSignature";
import portada from "@/assets/portada.jpg";

const PortadaQr = lazy(() => import("@/components/PortadaQr"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Daniel Jaimes — Portafolio" },
      { name: "description", content: "Portafolio de Daniel Jaimes: residencial, comercial e industrial." },
      { name: "theme-color", content: "#000000" },
      { name: "color-scheme", content: "dark" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black" },
    ],
  }),
  component: Index,
});

const hotspots = [
  { href: "residencia", label: "Residencial", top: "7%", left: "18%", width: "58%", height: "4%" },
  { href: "comercial", label: "Comercial", top: "28.5%", left: "18%", width: "58%", height: "4%" },
  { href: "industrial", label: "Industrial", top: "54.5%", left: "18%", width: "58%", height: "4%" },
  { href: "contacto", label: "Contacto", top: "76.5%", left: "18%", width: "58%", height: "3.5%" },
] as const;

const QR_BOX = { top: "83.8%", left: "34%", width: "31.5%", height: "13.5%" };
const PORTFOLIO_QR_URL = "https://dj75-portafolio.github.io/my-web-dream/";

function Index() {
  const base = import.meta.env.BASE_URL;

  return (
    <div data-portada className="min-h-screen w-full bg-black flex items-center justify-center">
      <div
        className="relative w-full bg-black [container-type:inline-size]"
        style={{ maxWidth: "min(100vw, calc(100vh * 897 / 1920))" }}
      >
        <img
          src={portada}
          alt="Portafolio Daniel Jaimes"
          className="block w-full h-auto select-none bg-black"
          draggable={false}
          fetchPriority="high"
          decoding="async"
          width={897}
          height={1920}
        />
        <PortadaSignature />

        {hotspots.map((h) => (
          <a
            key={h.href}
            href={`${base}${h.href}`}
            aria-label={h.label}
            className="absolute z-10 block rounded-sm transition-colors hover:bg-white/5 focus:bg-white/10 focus:outline-none"
            style={{
              top: h.top,
              left: h.left,
              width: h.width,
              height: h.height,
            }}
          />
        ))}
        <div
          className="absolute z-20 flex items-center justify-center overflow-hidden"
          style={{
            top: QR_BOX.top,
            left: QR_BOX.left,
            width: QR_BOX.width,
            height: QR_BOX.height,
          }}
          aria-label="Código QR del portafolio"
        >
          <div className="relative h-full aspect-square bg-black">
            <Suspense fallback={<div className="h-full w-full bg-white" aria-hidden="true" />}>
              <PortadaQr url={PORTFOLIO_QR_URL} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
