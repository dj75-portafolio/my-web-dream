import { createFileRoute } from "@tanstack/react-router";
import ProjectGallery from "@/components/ProjectGallery";
import { residenciaProjects, getProjectImages } from "@/lib/residencia";

export const Route = createFileRoute("/residencia")({
  head: () => ({ meta: [{ title: "Residencial — Portafolio" }] }),
  component: () => (
    <ProjectGallery
      title="Residencial"
      projects={residenciaProjects}
      getProjectImages={getProjectImages}
    />
  ),
});
