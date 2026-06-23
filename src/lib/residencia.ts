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
  { slug: "aptos-mt6", name: "APTOS MT6" },
  { slug: "casas-fachada-tipo", name: "CASAS FACHADA TIPO" },
  { slug: "apto-mosquera", name: "APTO MOSQUERA" },
  { slug: "casa-karina-reforma", name: "CASA KARINA REFORMA" },
  { slug: "casa-montoya", name: "CASA MONTOYA" },
  { slug: "apto-panama", name: "APTO PANAMA" },
  { slug: "casa-pozos", name: "CASA POZOS" },
  { slug: "apto-santa-barbara", name: "APTO SANTA BARBARA" },
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

  const urls = entries.map((e) => e.url);

  if (slug === "casa-montoya") {
    const byFile = new Map(entries.map((e) => [e.file, e.url]));
    const afterFichaFiles = [
      "montoya-4a.webp",
      "montoya-6a.webp",
      "montoya-ejec-01-planta-baja-n1.webp",
      "montoya-ejec-02-planta-n2-azotea.webp",
      "montoya-ejec-03-cortes-long.webp",
      "montoya-ejec-04-cortes-trans.webp",
      "montoya-ejec-05-fachadas.webp",
    ];
    const afterFicha = afterFichaFiles
      .map((file) => byFile.get(file))
      .filter((url): url is string => !!url);
    const used = new Set(afterFichaFiles);
    const fichaUrl = urls[0];
    const rest = entries
      .filter((e) => !e.file.startsWith("ficha") && !used.has(e.file))
      .map((e) => e.url);
    return [fichaUrl, ...afterFicha, ...rest];
  }

  return urls;
}

export function getProject(slug: string): Project | undefined {
  return residenciaProjects.find((p) => p.slug === slug);
}
