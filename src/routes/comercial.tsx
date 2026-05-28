import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/CategoryPage";

export const Route = createFileRoute("/comercial")({
  head: () => ({ meta: [{ title: "Comercial — Portafolio" }] }),
  component: () => <CategoryPage title="Comercial" />,
});
