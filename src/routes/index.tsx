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
    <div className="min-h-screen w-full bg-black flex items-center justify-center">
      <div
        className="relative w-full"
        style={{ maxWidth: "min(100vw, calc(100vh * 944 / 2007))" }}
      >
        <img
          src={portada}
          alt="Portafolio Daniel Jaimes"
          className="block w-full h-auto select-none"
          draggable={false}
        />
        {hotspots.map((h) => (
          <Link
            key={h.to}
            to={h.to}
            aria-label={h.label}
            className="absolute rounded-sm transition-colors hover:bg-white/5 focus:bg-white/10 focus:outline-none"
            style={{
              top: h.top,
              left: h.left,
              width: h.width,
              height: h.height,
            }}
          />
        ))}
      </div>
    </div>
  );
}
