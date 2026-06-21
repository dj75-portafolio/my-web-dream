import { createFileRoute } from "@tanstack/react-router";
import CvContactView from "@/components/CvContactView";
import { cvPageMeta } from "@/lib/cv";

export const Route = createFileRoute("/contacto")({
  head: () => ({
    meta: [
      { title: "Contacto — Portafolio" },
      { name: "description", content: cvPageMeta.description },
      { property: "og:title", content: "Contacto — Daniel Jaimes" },
      { property: "og:description", content: cvPageMeta.description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://dj75-portafolio.github.io/my-web-dream/contacto" },
      { property: "og:image", content: cvPageMeta.ogImage },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: cvPageMeta.ogImage },
    ],
  }),
  component: ContactoPage,
});

function ContactoPage() {
  return <CvContactView />;
}
