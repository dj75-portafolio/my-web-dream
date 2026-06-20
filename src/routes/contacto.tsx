import { createFileRoute } from "@tanstack/react-router";
import CvContactView from "@/components/CvContactView";

export const Route = createFileRoute("/contacto")({
  head: () => ({ meta: [{ title: "Contacto — Portafolio" }] }),
  component: ContactoPage,
});

function ContactoPage() {
  return <CvContactView />;
}
