import { createFileRoute } from "@tanstack/react-router";
import ProjectGallery from "@/components/ProjectGallery";
import { industrialProjects, getProjectImages } from "@/lib/industrial";

export const Route = createFileRoute("/industrial")({
  head: () => ({ meta: [{ title: "Industrial — Portafolio" }] }),
  component: () => (
    <ProjectGallery
      title="Industrial"
      projects={industrialProjects}
      getProjectImages={getProjectImages}
    />
  ),
});
