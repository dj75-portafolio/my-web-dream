/**
 * Ajusta solo la zona de la foto en public/contacto/cv.webp
 * (brillo y verde de ojos), sin tocar textos del resto de la hoja.
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const input = path.join(root, "public/contacto/cv.webp");

/** Misma zona que scripts/cv-to-print.mjs — solo retrato. */
const PHOTO = { left: 360, top: 80, width: 790, height: 880 };

const processedPhoto = await sharp(input)
  .extract(PHOTO)
  .modulate({ brightness: 0.9, saturation: 0.74 })
  .recomb([
    [1.02, 0.01, 0],
    [0.03, 0.82, 0.02],
    [0, 0.01, 0.96],
  ])
  .gamma(1.06)
  .toBuffer();

const output = path.join(root, "public/contacto/cv-adjusted.webp");

await sharp(input)
  .composite([{ input: processedPhoto, left: PHOTO.left, top: PHOTO.top }])
  .webp({ quality: 88, effort: 4 })
  .toFile(output);

await import("node:fs/promises").then((fs) =>
  fs.rename(output, input),
);

console.log("cv.webp: ajuste aplicado solo en zona foto", PHOTO);
