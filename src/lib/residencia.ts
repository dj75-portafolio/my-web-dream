// Proyectos de Residencial. Para añadir imágenes, sube los archivos .webp
// a src/assets/residencia/<slug>/. El archivo que empiece con "ficha"
// aparecerá siempre primero en el carrusel del proyecto.

export type Project = {
  slug: string;
  name: string;
};

export const residenciaProjects: Project[] = [
  { slug: "casa-esquina", name: "CASA ESQUINA" },
  { slug: "casa-antena", name: "CASA ANTENA" },
  { slug: "casa-matallana", name: "CASA MATALLANA" },
  { slug: "casas-fachada-tipo", name: "CASAS FACHADA TIPO" },
  { slug: "apto-mosquera", name: "APTO MOSQUERA" },
  { slug: "casa-karina-reforma", name: "CASA KARINA REFORMA" },
  { slug: "casa-montoya", name: "CASA MONTOYA" },
  { slug: "apto-panama", name: "APTO PANAMA" },
  { slug: "casa-pozos", name: "CASA POZOS" },
  { slug: "apto-santa-barbara", name: "APTO SANTA BARBARA" },
  { slug: "aptos-mt6", name: "APTOS MT6" },
];

// Carga ansiosa de todas las imágenes .webp dentro de las carpetas de cada proyecto.
const imageModules = import.meta.glob(
  "/src/assets/residencia/*/*.{webp,jpg,jpeg,png}",
  { eager: true, query: "?url", import: "default" },
) as Record<string, string>;

export function getProjectImages(slug: string): string[] {
  const entries = Object.entries(imageModules)
    .filter(([path]) => path.includes(`/residencia/${slug}/`))
    .map(([path, url]) => ({
      file: path.split("/").pop()!.toLowerCase(),
      url,
    }));

  // La ficha (archivo cuyo nombre empieza con "ficha") siempre primero.
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
  return residenciaProjects.find((p) => p.slug === slug);
}
