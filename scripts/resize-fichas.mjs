/**
 * Redimensiona fichas muy grandes (Industrial) para carga rápida en móvil.
 * Uso: node scripts/resize-fichas.mjs src/assets/industrial
 */
import { readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const root = process.argv[2] ?? "src/assets/industrial";
const MAX_WIDTH = 2400;
const WEBP_QUALITY = 82;

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(full)));
    else if (/^ficha\.(webp|jpg|jpeg|png)$/i.test(entry.name)) files.push(full);
  }
  return files;
}

for (const file of await walk(root)) {
  const meta = await sharp(file).metadata();
  const before = (await stat(file)).size;
  if ((meta.width ?? 0) <= MAX_WIDTH && before < 350 * 1024) continue;

  const out = file.replace(/\.(webp|jpe?g|png)$/i, ".webp");
  const buffer = await sharp(file)
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY, effort: 4 })
    .toBuffer();

  const { unlink, writeFile } = await import("node:fs/promises");
  if (out !== file) await unlink(file).catch(() => {});
  await writeFile(out, buffer);
  const after = buffer.length;

  console.log(
    `${file.split("assets/")[1] ?? file}: ${meta.width}px → max ${MAX_WIDTH}px (${Math.round(before / 1024)}KB → ${Math.round(after / 1024)}KB)`,
  );
}
