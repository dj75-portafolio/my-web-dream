/**
 * Convierte JPG/PNG pesados a WebP (solo desarrollo local).
 * Requiere: npm install sharp --no-save
 * Uso: node scripts/optimize-images.mjs src/assets [minKB]
 */
import { readdir, stat, unlink } from "node:fs/promises";
import { join, extname, basename } from "node:path";

let sharp;
try {
  sharp = (await import("sharp")).default;
} catch {
  console.error("Instala sharp localmente: npm install sharp --no-save");
  process.exit(1);
}

const root = process.argv[2] ?? "src/assets";
const MIN_KB = Number(process.argv[3] ?? 400);
const WEBP_QUALITY = 82;

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else files.push(full);
  }
  return files;
}

const files = await walk(root);
let saved = 0;

for (const file of files) {
  const ext = extname(file).toLowerCase();
  if (![".jpg", ".jpeg", ".png"].includes(ext)) continue;

  const { size } = await stat(file);
  if (size < MIN_KB * 1024) continue;

  const out = join(file.slice(0, -ext.length) + ".webp");
  const before = size;
  await sharp(file).webp({ quality: WEBP_QUALITY, effort: 4 }).toFile(out);
  const after = (await stat(out)).size;

  if (after < before * 0.95) {
    await unlink(file);
    saved += before - after;
    console.log(
      `✓ ${basename(file)} → ${basename(out)} (${Math.round(before / 1024)}KB → ${Math.round(after / 1024)}KB)`,
    );
  } else {
    await unlink(out);
  }
}

console.log(`\nTotal ahorrado: ${Math.round(saved / 1024)} KB`);
