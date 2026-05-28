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
    <div className="relative min-h-screen overflow-hidden bg-[#3b3b3d]">
      {/* DANIEL JAIMES — vertical izquierda */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 flex items-center select-none"
        style={{ paddingLeft: "2vw" }}
      >
        <span
          className="font-light uppercase"
          style={{
            writingMode: "vertical-rl",
            transform: "rotate(180deg)",
            fontSize: "clamp(2.4rem, 11vw, 7rem)",
            letterSpacing: "0.18em",
            color: "#8a7d72",
            fontFamily: "'Antonio', 'Oswald', 'Barlow Condensed', sans-serif",
            fontStretch: "condensed",
          }}
        >
          DANIEL JAIMES
        </span>
      </div>

      {/* PORTAFOLIO — vertical derecha */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 flex items-center select-none"
        style={{ paddingRight: "2vw" }}
      >
        <span
          className="font-light uppercase"
          style={{
            writingMode: "vertical-rl",
            fontSize: "clamp(2.4rem, 11vw, 7rem)",
            letterSpacing: "0.18em",
            color: "#8a7d72",
            fontFamily: "'Antonio', 'Oswald', 'Barlow Condensed', sans-serif",
            fontStretch: "condensed",
          }}
        >
          PORTAFOLIO
        </span>
      </div>

      {/* Botones centrales */}
      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-24 md:gap-32 px-8 py-20">
        {sections.map((s) => (
          <Link
            key={s.to}
            to={s.to}
            className="font-light uppercase transition-opacity hover:opacity-100"
            style={{
              color: "#b8b0a8",
              letterSpacing: "0.45em",
              fontSize: "clamp(1.1rem, 3vw, 1.75rem)",
              opacity: 0.85,
            }}
          >
            {s.label}
          </Link>
        ))}
      </main>

      {/* CONTACTO inferior */}
      <Link
        to="/contacto"
        className="absolute left-1/2 -translate-x-1/2 font-light uppercase transition-opacity hover:opacity-100"
        style={{
          bottom: "2.5rem",
          color: "#9a9189",
          letterSpacing: "0.45em",
          fontSize: "clamp(0.85rem, 1.6vw, 1.05rem)",
          opacity: 0.75,
        }}
      >
        CONTACTO
      </Link>
    </div>
  );
}
