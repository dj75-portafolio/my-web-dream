export type Project = {
  slug: string;
  name: string;
};

export const industrialProjects: Project[] = [
  { slug: "proyecto-zolino", name: "PROYECTO ZOLINO" },
  { slug: "cocina-industrial-panama", name: "COCINA INDUSTRIAL PANAMA" },
  { slug: "reforma-cocina-alex", name: "REFORMA COCINA ALEX" },
];

const imageModules = import.meta.glob(
  "/src/assets/industrial/*/*.{webp,jpg,jpeg,png}",
  { eager: true, query: "?url", import: "default" },
) as Record<string, string>;

export function getProjectImages(slug: string): string[] {
  const entries = Object.entries(imageModules)
    .filter(([path]) => path.includes(`/industrial/${slug}/`))
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

  const urls = entries.map((e) => e.url);

  if (slug === "cocina-industrial-panama" && urls.length > 6) {
    const ordered = [...urls];
    [ordered[1], ordered[3]] = [ordered[3], ordered[1]];
    const [third] = ordered.splice(2, 1);
    ordered.splice(6, 0, third);
    return ordered;
  }

  return urls;
}

export function getProject(slug: string): Project | undefined {
  return industrialProjects.find((p) => p.slug === slug);
}
