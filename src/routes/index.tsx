import { createFileRoute, Link } from "@tanstack/react-router";
import { QRCodeSVG } from "qrcode.react";
import PortadaSignature from "@/components/PortadaSignature";
import portada from "@/assets/portada.jpg";

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

/** Mismo desplazamiento hacia arriba para menú y bloque QR (mantiene proporciones). */
const PORTADA_SHIFT_UP_PCT = 6.5;

function shiftTopPercent(top: string): string {
  const value = Number.parseFloat(top);
  return `${Math.max(0.3, value - PORTADA_SHIFT_UP_PCT).toFixed(1)}%`;
}

const hotspots = [
  { to: "/residencia" as const, label: "Residencial", top: "7%", left: "18%", width: "58%", height: "4%" },
  { to: "/comercial" as const, label: "Comercial", top: "28.5%", left: "18%", width: "58%", height: "4%" },
  { to: "/industrial" as const, label: "Industrial", top: "54.5%", left: "18%", width: "58%", height: "4%" },
  { to: "/contacto" as const, label: "Contacto", top: "76.5%", left: "18%", width: "58%", height: "3.5%" },
].map((h) => ({ ...h, top: shiftTopPercent(h.top) }));

// Posición del QR impreso en la portada (coordenadas relativas a la imagen)
const QR_BOX = {
  top: shiftTopPercent("83.8%"),
  left: "34%",
  width: "31.5%",
  height: "12.8%",
};
const PORTFOLIO_QR_URL = "https://dj75-portafolio.github.io/my-web-dream/";

function Index() {
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
        />
        <PortadaSignature />
        {hotspots.map((h) => (
          <Link
            key={h.to}
            to={h.to}
            preload="intent"
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
        {/* QR cuadrado: sin franjas blancas laterales */}
        <div
          className="absolute z-20 flex flex-col items-center"
          style={{
            top: QR_BOX.top,
            left: QR_BOX.left,
            width: QR_BOX.width,
          }}
        >
          <div
            className="flex w-full items-center justify-center overflow-hidden"
            style={{ height: QR_BOX.height }}
            aria-label="Código QR del portafolio"
          >
            <div className="relative h-full aspect-square bg-black">
              <QRCodeSVG
                value={PORTFOLIO_QR_URL}
                level="M"
                bgColor="#ffffff"
                fgColor="#000000"
                className="h-full w-full"
              />
            </div>
          </div>
          <p className="mt-[0.9cqw] text-[1.9cqw] leading-none tracking-[0.06em] text-white/50 text-center">
            developed by Daniel Jaimes
          </p>
        </div>
      </div>
    </div>
  );
}

