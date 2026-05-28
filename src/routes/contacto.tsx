import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/CategoryPage";

export const Route = createFileRoute("/contacto")({
  head: () => ({ meta: [{ title: "Contacto — Portafolio" }] }),
  component: () => <CategoryPage title="Contacto" />,
});
