import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Daniel Jaimes — Portafolio" },
      { name: "description", content: "Portafolio de Daniel Jaimes: residencial, comercial e industrial." },
    ],
  }),
  component: Index,
});

const sections = [
  { label: "RESIDENCIAL", to: "/residencia" as const },
  { label: "COMERCIAL", to: "/comercial" as const },
  { label: "INDUSTRIAL", to: "/industrial" as const },
];

function Index() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#3a3a3c] text-white">
      {/* Lateral izquierda: DANIEL JAIMES */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center px-4 select-none"
      >
        <span
          className="font-light uppercase text-white/25"
          style={{
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
            fontSize: "clamp(2rem, 9vw, 5rem)",
            letterSpacing: "0.35em",
          }}
        >
          Daniel Jaimes
        </span>
      </div>

      {/* Lateral derecha: PORTAFOLIO */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 flex items-center justify-center px-4 select-none"
      >
        <span
          className="font-light uppercase text-white/25"
          style={{
            writingMode: "vertical-rl",
            fontSize: "clamp(2rem, 9vw, 5rem)",
            letterSpacing: "0.35em",
          }}
        >
          Portafolio
        </span>
      </div>

      {/* Botones centrales */}
      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-20 px-8 py-16">
        {sections.map((s) => (
          <Link
            key={s.to}
            to={s.to}
            className="text-xl md:text-2xl font-light uppercase text-white/70 transition-colors hover:text-white"
            style={{ letterSpacing: "0.4em" }}
          >
            {s.label}
          </Link>
        ))}
      </main>

      {/* Contacto abajo */}
      <Link
        to="/contacto"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm md:text-base font-light uppercase text-white/40 transition-colors hover:text-white/80"
        style={{ letterSpacing: "0.4em" }}
      >
        CONTACTO
      </Link>
    </div>
  );
}
