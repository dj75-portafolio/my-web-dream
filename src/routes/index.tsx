import { createFileRoute, Link } from "@tanstack/react-router";
import { QRCodeSVG } from "qrcode.react";
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

// Posición del QR impreso en la portada (coordenadas relativas a la imagen)
const QR_BOX = { top: "83.8%", left: "34%", width: "31.5%", height: "13.5%" };
const PORTFOLIO_QR_URL = "https://dj75-portafolio.github.io/my-web-dream/";

function Index() {
  return (
    <div data-portada className="min-h-screen w-full bg-black flex items-center justify-center">
      <div
        className="relative w-full bg-black"
        style={{ maxWidth: "min(100vw, calc(100vh * 897 / 1920))" }}
      >
        <img
          src={portada}
          alt="Portafolio Daniel Jaimes"
          className="block w-full h-auto select-none bg-black brightness-[0.96] contrast-[1.08]"
          draggable={false}
        />
        {hotspots.map((h) => (
          <Link
            key={h.to}
            to={h.to}
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
        {/* QR funcional superpuesto sobre el QR impreso en la imagen */}
        <div
          className="absolute z-20 flex items-center justify-center overflow-hidden bg-white"
          style={{
            top: QR_BOX.top,
            left: QR_BOX.left,
            width: QR_BOX.width,
            height: QR_BOX.height,
          }}
          aria-label="Código QR del portafolio"
        >
          <QRCodeSVG
            value={PORTFOLIO_QR_URL}
            level="M"
            bgColor="#ffffff"
            fgColor="#000000"
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      </div>
    </div>
  );
}

