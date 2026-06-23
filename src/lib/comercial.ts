import { createSectionImageLoader } from "@/lib/project-images";

export type Project = {
  slug: string;
  name: string;
};

export const comercialProjects: Project[] = [
  { slug: "glamping-la-prosperidad", name: "GLAMPING LA PROSPERIDAD" },
  { slug: "dli-paleteria-sede-campestre", name: "DLI PALETERIA SEDE CAMPESTRE" },
  { slug: "dli-paleteria-cali", name: "DLI PALETERIA CALI" },
  { slug: "homecenter-k30", name: "HOMECENTER K30" },
  { slug: "isla-mercurio-y-varias", name: "ISLA MERCURIO Y VARIAS" },
  { slug: "santa-barbara", name: "SANTA BARBARA" },
  { slug: "santa-marta", name: "SANTA MARTA" },
  { slug: "villavicencio", name: "VILLAVICENCIO" },
];

const allModules = import.meta.glob(
  "/src/assets/comercial/*/*.{webp,jpg,jpeg,png}",
  { query: "?url", import: "default" },
) as Record<string, () => Promise<string>>;

const loader = createSectionImageLoader("comercial", allModules, (slug, entries) => {
  const urls = entries.map((e) => e.url);

  if (slug === "glamping-la-prosperidad") {
    if (urls.length <= 5) return urls;
    return [urls[0], ...urls.slice(4, 8), ...urls.slice(1, 4), ...urls.slice(8)];
  }

  return urls;
});

export const getFichaUrl = loader.getFichaUrl;
export const loadFichaUrl = loader.loadFichaUrl;
export const loadProjectImages = loader.loadProjectImages;
export const getProjectImages = loader.getProjectImages;

export function getProject(slug: string): Project | undefined {
  return comercialProjects.find((p) => p.slug === slug);
}
