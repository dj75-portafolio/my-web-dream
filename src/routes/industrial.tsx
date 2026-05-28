import { createFileRoute } from "@tanstack/react-router";
import { CategoryPage } from "@/components/CategoryPage";

export const Route = createFileRoute("/industrial")({
  head: () => ({ meta: [{ title: "Industrial — Portafolio" }] }),
  component: () => <CategoryPage title="Industrial" />,
});
