import { createSectionImageLoader } from "@/lib/project-images";

export type Project = {
  slug: string;
  name: string;
};

export const industrialProjects: Project[] = [
  { slug: "proyecto-zolino", name: "PROYECTO ZOLINO" },
  { slug: "cocina-industrial-panama", name: "COCINA INDUSTRIAL PANAMA" },
  { slug: "reforma-cocina-alex", name: "REFORMA COCINA ALEX" },
];

const allModules = import.meta.glob(
  "/src/assets/industrial/*/*.{webp,jpg,jpeg,png}",
  { query: "?url", import: "default" },
) as Record<string, () => Promise<string>>;

const loader = createSectionImageLoader("industrial", allModules, (slug, entries) => {
  const urls = entries.map((e) => e.url);

  if (slug === "cocina-industrial-panama" && urls.length > 6) {
    const ordered = [...urls];
    [ordered[1], ordered[3]] = [ordered[3], ordered[1]];
    const [third] = ordered.splice(2, 1);
    ordered.splice(6, 0, third);
    return ordered;
  }

  return urls;
});

export const getFichaUrl = loader.getFichaUrl;
export const loadFichaUrl = loader.loadFichaUrl;
export const loadProjectImages = loader.loadProjectImages;
export const getProjectImages = loader.getProjectImages;

export function getProject(slug: string): Project | undefined {
  return industrialProjects.find((p) => p.slug === slug);
}
