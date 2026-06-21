import { createFileRoute } from "@tanstack/react-router";
import CvContactView from "@/components/CvContactView";

/** Alias corto; el enlace principal para compartir es /cv-dj */
export const Route = createFileRoute("/cv")({
  head: () => ({
    meta: [
      { title: "CV — Daniel Jaimes" },
      {
        name: "description",
        content: "CV simplificado de Daniel Jaimes. Contacto por WhatsApp y correo.",
      },
    ],
  }),
  component: CvPage,
});

function CvPage() {
  return <CvContactView standalone />;
}
