type ImageEntry = { file: string; url: string };

type OrderFn = (slug: string, entries: ImageEntry[]) => string[];

function slugFromSectionPath(section: string, path: string): string {
  const marker = `/assets/${section}/`;
  const i = path.indexOf(marker);
  if (i === -1) return "";
  return path.slice(i + marker.length).split("/")[0] ?? "";
}

function sortEntries(entries: ImageEntry[]): ImageEntry[] {
  return [...entries].sort((a, b) => {
    const aIsFicha = a.file.startsWith("ficha");
    const bIsFicha = b.file.startsWith("ficha");
    if (aIsFicha && !bIsFicha) return -1;
    if (!aIsFicha && bIsFicha) return 1;
    return a.file.localeCompare(b.file);
  });
}

function isFichaPath(path: string): boolean {
  return path.split("/").pop()!.toLowerCase().startsWith("ficha");
}

export function createSectionImageLoader(
  section: string,
  fichaModules: Record<string, string>,
  allModules: Record<string, () => Promise<string>>,
  orderUrls?: OrderFn,
) {
  const fichaBySlug = new Map<string, string>();
  for (const [path, url] of Object.entries(fichaModules)) {
    const slug = slugFromSectionPath(section, path);
    if (slug && isFichaPath(path)) {
      fichaBySlug.set(slug, url);
    }
  }

  const cache = new Map<string, string[]>();

  function getFichaUrl(slug: string): string | undefined {
    return cache.get(slug)?.[0] ?? fichaBySlug.get(slug);
  }

  async function loadProjectImages(slug: string): Promise<string[]> {
    const cached = cache.get(slug);
    if (cached) return cached;

    const loaders = Object.entries(allModules).filter(([path]) =>
      path.includes(`/assets/${section}/${slug}/`),
    );

    const entries: ImageEntry[] = await Promise.all(
      loaders.map(async ([path, load]) => ({
        file: path.split("/").pop()!.toLowerCase(),
        url: await load(),
      })),
    );

    const sorted = sortEntries(entries);
    const urls = orderUrls ? orderUrls(slug, sorted) : sorted.map((e) => e.url);
    cache.set(slug, urls);
    return urls;
  }

  function getProjectImages(slug: string): string[] {
    return cache.get(slug) ?? [];
  }

  return { getFichaUrl, loadProjectImages, getProjectImages };
}
