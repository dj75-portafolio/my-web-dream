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

const TEXT_COLOR = "#e5e5e5";

function Index() {
  return (
    <div className="min-h-screen w-full bg-[#141416] text-[color:var(--fg)] flex flex-col"
      style={{ ["--fg" as never]: TEXT_COLOR }}
    >
      <main className="relative flex-1 flex flex-col items-center justify-center px-6 py-16">
        {/* PORTAFOLIO vertical right margin - outlined only */}
        <div
          aria-hidden
          className="hidden sm:block absolute right-4 md:right-8 top-1/2 -translate-y-1/2 select-none pointer-events-none"
        >
          <span
            className="block font-bold tracking-[0.35em] text-[14vh] leading-none"
            style={{
              writingMode: "vertical-rl",
              transform: "rotate(180deg)",
              WebkitTextStroke: `2px ${TEXT_COLOR}`,
              color: "transparent",
            }}
          >
            PORTAFOLIO
          </span>
        </div>

        {/* DANIEL JAIMES */}
        <h1
          className="font-extrabold tracking-[0.18em] text-center leading-none"
          style={{
            color: TEXT_COLOR,
            fontSize: "clamp(2.5rem, 9vw, 8rem)",
          }}
        >
          DANIEL JAIMES
        </h1>

        {/* Categories */}
        <nav className="mt-16 md:mt-24 flex flex-col items-center gap-6 md:gap-8">
          {(["Residencial", "Comercial", "Industrial"] as const).map((label) => {
            const to =
              label === "Residencial"
                ? "/residencia"
                : label === "Comercial"
                ? "/comercial"
                : "/industrial";
            return (
              <Link
                key={label}
                to={to}
                className="font-semibold tracking-[0.3em] uppercase transition-opacity hover:opacity-70"
                style={{
                  color: TEXT_COLOR,
                  fontSize: "clamp(1.25rem, 3vw, 2.25rem)",
                }}
              >
                {label}
              </Link>
            );
          })}

          <Link
            to="/contacto"
            className="mt-8 md:mt-12 font-semibold tracking-[0.3em] uppercase transition-opacity hover:opacity-70"
            style={{
              color: TEXT_COLOR,
              fontSize: "clamp(0.9rem, 1.6vw, 1.25rem)",
            }}
          >
            Contacto
          </Link>
        </nav>
      </main>
    </div>
  );
}
