import { createFileRoute } from "@tanstack/react-router";
import ProjectGallery from "@/components/ProjectGallery";
import { comercialProjects, getFichaUrl, loadProjectImages } from "@/lib/comercial";

export const Route = createFileRoute("/comercial")({
  head: () => ({ meta: [{ title: "Comercial — Portafolio" }] }),
  component: () => (
    <ProjectGallery
      title="Comercial"
      projects={comercialProjects}
      getFichaUrl={getFichaUrl}
      loadProjectImages={loadProjectImages}
    />
  ),
});
