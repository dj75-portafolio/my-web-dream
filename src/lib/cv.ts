/** Sube este número al reemplazar public/contacto/cv.webp (fuerza vista nueva en celular/WhatsApp). */
export const CV_VERSION = "2026-06-22-logo-dark";

const SITE_ORIGIN = "https://dj75-portafolio.github.io/my-web-dream";

export function getCvImageUrl() {
  return `${import.meta.env.BASE_URL}contacto/cv.webp?v=${CV_VERSION}`;
}

export function getCvOgImageUrl() {
  return `${SITE_ORIGIN}/contacto/cv.webp?v=${CV_VERSION}`;
}

export function getCvShareUrl() {
  return `${SITE_ORIGIN}/cv-dj`;
}

export const cvPageMeta = {
  title: "CV DJ — Daniel Jaimes",
  description: "CV simplificado de Daniel Jaimes. Contacto por WhatsApp y correo.",
  ogImage: getCvOgImageUrl(),
  ogUrl: getCvShareUrl(),
};
