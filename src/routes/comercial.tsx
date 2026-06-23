import { createFileRoute } from "@tanstack/react-router";
import ProjectGallery from "@/components/ProjectGallery";
import { comercialProjects, loadFichaUrl, loadProjectImages } from "@/lib/comercial";

export const Route = createFileRoute("/comercial")({
  head: () => ({ meta: [{ title: "Comercial — Portafolio" }] }),
  component: () => (
    <ProjectGallery
      title="Comercial"
      projects={comercialProjects}
      loadFichaUrl={loadFichaUrl}
      loadProjectImages={loadProjectImages}
    />
  ),
});
