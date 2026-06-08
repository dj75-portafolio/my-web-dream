import { createFileRoute, Link } from "@tanstack/react-router";
import portada from "@/assets/portada.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Daniel Jaimes — Portafolio" },
      { name: "description", content: "Portafolio de Daniel Jaimes: residencial, comercial e industrial." },
    ],
  }),
  component: Index,
});

// Zonas clicables sobre la imagen (porcentajes relativos a la imagen original).
// La imagen mide 944x2007 aprox. Estas cajas cubren cada palabra.
const hotspots = [
  { to: "/residencia" as const, label: "Residencial", top: "23%", left: "22%", width: "56%", height: "5%" },
  { to: "/comercial" as const,  label: "Comercial",  top: "47%", left: "22%", width: "56%", height: "5%" },
  { to: "/industrial" as const, label: "Industrial", top: "71%", left: "22%", width: "56%", height: "5%" },
  { to: "/contacto" as const,   label: "Contacto",   top: "95%", left: "30%", width: "40%", height: "4%", intense: true },
];

function Index() {
  return (
    <div className="min-h-screen w-full bg-[#3b3b3d] flex items-center justify-center">
      <div
        className="relative w-full"
        style={{ maxWidth: "min(100vw, calc(100vh * 944 / 2007))" }}
      >
        <img
          src={portada}
          alt="Portafolio Daniel Jaimes"
          className="block w-full h-auto select-none"
          style={{ filter: "brightness(1.15) contrast(1.1)" }}
          draggable={false}
        />
        {/* Texto superpuesto para dar más intensidad a palabras clave */}
        <span
          className="absolute left-1/2 -translate-x-1/2 text-white font-black uppercase tracking-[0.25em] pointer-events-none"
          style={{
            top: "12%",
            fontSize: "clamp(14px, 4.5vw, 26px)",
            textShadow:
              "0 0 6px rgba(0,0,0,0.95), 0 0 14px rgba(0,0,0,0.85), 0 2px 4px rgba(0,0,0,1)",
          }}
        >
          Portafolio
        </span>
        {hotspots.map((h) => (
          <Link
            key={h.to}
            to={h.to}
            aria-label={h.label}
            className="absolute rounded-sm transition-colors hover:bg-white/5 focus:bg-white/10 focus:outline-none flex items-center justify-center"
            style={{
              top: h.top,
              left: h.left,
              width: h.width,
              height: h.height,
            }}
          >
            {h.label === "Contacto" && (
              <span
                className="text-white font-black uppercase tracking-[0.2em]"
                style={{
                  fontSize: "clamp(10px, 3vw, 18px)",
                  textShadow:
                    "0 0 6px rgba(0,0,0,0.95), 0 0 14px rgba(0,0,0,0.85), 0 2px 4px rgba(0,0,0,1)",
                }}
              >
                Contacto
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
