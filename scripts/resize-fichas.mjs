/**
 * Redimensiona fichas muy grandes (solo desarrollo local).
 * Requiere: npm install sharp --no-save
 */
import { readdir, stat } from "node:fs/promises";
import { join } from "node:path";

let sharp;
try {
  sharp = (await import("sharp")).default;
} catch {
  console.error("Instala sharp localmente: npm install sharp --no-save");
  process.exit(1);
}

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
  const tmp = `${file}.tmp`;
  await writeFile(tmp, buffer);
  if (out !== file) await unlink(file).catch(() => {});
  try {
    await writeFile(out, buffer);
  } catch {
    const { rename } = await import("node:fs/promises");
    await rename(tmp, out);
  }
  await unlink(tmp).catch(() => {});
  const after = buffer.length;

  console.log(
    `${file.split("assets/")[1] ?? file}: ${meta.width}px → max ${MAX_WIDTH}px (${Math.round(before / 1024)}KB → ${Math.round(after / 1024)}KB)`,
  );
}
