import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/CategoryPage";

export const Route = createFileRoute("/residencia")({
  head: () => ({ meta: [{ title: "Residencia — Portafolio" }] }),
  component: () => <CategoryPage title="Residencia" />,
});
