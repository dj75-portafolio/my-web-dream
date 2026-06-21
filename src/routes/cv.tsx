import { createFileRoute } from "@tanstack/react-router";
import CvContactView from "@/components/CvContactView";
import { cvPageMeta } from "@/lib/cv";

/** Alias corto; el enlace principal para compartir es /cv-dj */
export const Route = createFileRoute("/cv")({
  head: () => ({
    meta: [
      { title: "CV — Daniel Jaimes" },
      { name: "description", content: cvPageMeta.description },
      { property: "og:title", content: cvPageMeta.title },
      { property: "og:description", content: cvPageMeta.description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: cvPageMeta.ogUrl },
      { property: "og:image", content: cvPageMeta.ogImage },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: cvPageMeta.ogImage },
    ],
  }),
  component: CvPage,
});

function CvPage() {
  return <CvContactView />;
}
