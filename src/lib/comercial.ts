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

const imageModules = import.meta.glob(
  "/src/assets/comercial/*/*.{webp,jpg,jpeg,png}",
  { eager: true, query: "?url", import: "default" },
) as Record<string, string>;

export function getProjectImages(slug: string): string[] {
  const entries = Object.entries(imageModules)
    .filter(([path]) => path.includes(`/comercial/${slug}/`))
    .map(([path, url]) => ({
      file: path.split("/").pop()!.toLowerCase(),
      url,
    }));

  entries.sort((a, b) => {
    const aIsFicha = a.file.startsWith("ficha");
    const bIsFicha = b.file.startsWith("ficha");
    if (aIsFicha && !bIsFicha) return -1;
    if (!aIsFicha && bIsFicha) return 1;
    return a.file.localeCompare(b.file);
  });

  return entries.map((e) => e.url);
}

export function getProject(slug: string): Project | undefined {
  return comercialProjects.find((p) => p.slug === slug);
}
