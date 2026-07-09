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

const hotspots = [
  { to: "/residencia" as const, label: "Residencial", top: "7%", left: "18%", width: "58%", height: "4%" },
  { to: "/comercial" as const, label: "Comercial", top: "28.5%", left: "18%", width: "58%", height: "4%" },
  { to: "/industrial" as const, label: "Industrial", top: "54.5%", left: "18%", width: "58%", height: "4%" },
  { to: "/contacto" as const, label: "Contacto", top: "76.5%", left: "18%", width: "58%", height: "3.5%" },
];

// Parche negro sobre el QR gris impreso en portada.jpg (solo queda el QR blanco activo).
const QR_PATCH = { top: "82.4%", left: "30%", width: "40%", height: "15.8%" };
const QR_BOX = { top: "85.2%", left: "34%", width: "31.5%", height: "10.4%" };
const CREDIT_BOX = { top: "96.7%", left: "34%", width: "31.5%" };
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
        <div
          className="absolute z-[15] bg-black pointer-events-none"
          style={{
            top: QR_PATCH.top,
            left: QR_PATCH.left,
            width: QR_PATCH.width,
            height: QR_PATCH.height,
          }}
          aria-hidden="true"
        />
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
            <QRCodeSVG
              value={PORTFOLIO_QR_URL}
              level="M"
              bgColor="#ffffff"
              fgColor="#000000"
              className="h-full w-full"
            />
          </div>
        </div>
        <p
          className="absolute z-20 text-[1.85cqw] leading-none tracking-[0.05em] text-[#8a8a8a] text-center pointer-events-none"
          style={{
            top: CREDIT_BOX.top,
            left: CREDIT_BOX.left,
            width: CREDIT_BOX.width,
          }}
        >
          developed by Daniel Jaimes
        </p>
      </div>
    </div>
  );
}
