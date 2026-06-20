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

const customOrder: Record<string, string[]> = {
  "cocina-industrial-panama": [
    "ficha.jpg",
    "img-05.jpg",
    "img-09.jpg",
    "img-01.jpg",
    "img-02.jpg",
    "img-03.jpg",
    "img-04.jpg",
    "img-06.jpg",
    "img-07.jpg",
    "img-08.jpg",
  ],
};

export function getProjectImages(slug: string): string[] {
  const entries = Object.entries(imageModules)
    .filter(([path]) => path.includes(`/industrial/${slug}/`))
    .map(([path, url]) => ({
      file: path.split("/").pop()!.toLowerCase(),
      url,
    }));

  const order = customOrder[slug];
  if (order) {
    const urlByFile = new Map(entries.map((e) => [e.file, e.url]));
    return order.map((file) => urlByFile.get(file)).filter(Boolean) as string[];
  }

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
  return industrialProjects.find((p) => p.slug === slug);
}
