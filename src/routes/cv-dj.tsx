import { createFileRoute } from "@tanstack/react-router";
import CvContactView from "@/components/CvContactView";

export const Route = createFileRoute("/cv-dj")({
  head: () => ({
    meta: [
      { title: "CV DJ — Daniel Jaimes" },
      {
        name: "description",
        content: "CV simplificado de Daniel Jaimes. Contacto por WhatsApp y correo.",
      },
    ],
  }),
  component: CvDjPage,
});

function CvDjPage() {
  return <CvContactView standalone />;
}
