/**
 * Ajusta solo la zona del retrato en public/contacto/cv.webp:
 * tono unificado, ojos menos verdes, sin parche visible.
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const input = path.join(root, "public/contacto/cv.webp");

/** Retrato completo (incluye barbilla, cuello y camiseta dentro del marco). */
const PHOTO = { left: 360, top: 80, width: 790, height: 1260 };

const FEATHER = { top: 45, bottom: 110, sides: 28 };

function blendMask(x, y, width, height) {
  let blend = 1;

  if (y < FEATHER.top) blend = y / FEATHER.top;
  else if (y > height - FEATHER.bottom) blend = (height - y) / FEATHER.bottom;

  if (x < FEATHER.sides) blend *= x / FEATHER.sides;
  else if (x > width - FEATHER.sides) blend *= (width - x) / FEATHER.sides;

  return Math.max(0, Math.min(1, blend));
}

const original = await sharp(input)
  .extract(PHOTO)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const adjusted = await sharp(input)
  .extract(PHOTO)
  .modulate({ brightness: 0.9, saturation: 0.76 })
  .recomb([
    [1.01, 0.01, 0],
    [0.02, 0.88, 0.02],
    [0, 0.01, 0.98],
  ])
  .gamma(1.03)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width, height, channels } = original.info;
const out = Buffer.alloc(original.data.length);

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const blend = blendMask(x, y, width, height);
    const i = (y * width + x) * channels;

    for (let c = 0; c < 3; c++) {
      out[i + c] = Math.round(adjusted.data[i + c] * blend + original.data[i + c] * (1 - blend));
    }
    out[i + 3] = original.data[i + 3] ?? 255;
  }
}

const photoBuffer = await sharp(out, { raw: { width, height, channels } }).png().toBuffer();
const output = path.join(root, "public/contacto/cv-adjusted.webp");

await sharp(input)
  .composite([{ input: photoBuffer, left: PHOTO.left, top: PHOTO.top }])
  .webp({ quality: 88, effort: 4 })
  .toFile(output);

await import("node:fs/promises").then((fs) => fs.rename(output, input));

console.log("cv.webp: retrato unificado", PHOTO);
