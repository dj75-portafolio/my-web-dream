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
    "ficha",
    "img-05",
    "img-09",
    "img-01",
    "img-02",
    "img-03",
    "img-04",
    "img-06",
    "img-07",
    "img-08",
  ],
};

function resolveImageStem(urlByFile: Map<string, string>, stem: string): string | undefined {
  const key = stem.toLowerCase().replace(/\.[^.]+$/, "");
  for (const [file, url] of urlByFile) {
    if (file.replace(/\.[^.]+$/, "") === key) return url;
  }
  return undefined;
}

export function getProjectImages(slug: string): string[] {
  const entries = Object.entries(imageModules)
    .filter(([path]) => path.includes(`/industrial/${slug}/`))
    .map(([path, url]) => ({
      file: path.split("/").pop()!.toLowerCase(),
      url,
    }));

  const urlByFile = new Map(entries.map((e) => [e.file, e.url]));
  const order = customOrder[slug];
  if (order) {
    return order.map((stem) => resolveImageStem(urlByFile, stem)).filter(Boolean) as string[];
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
