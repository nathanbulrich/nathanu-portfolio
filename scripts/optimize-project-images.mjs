import { createHash } from "node:crypto";
import { mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = fileURLToPath(new URL("../", import.meta.url));
const imageDir = path.join(root, "public/images");
const outputDir = path.join(imageDir, "optimized");
await mkdir(outputDir, { recursive: true });

const manifest = {};
const files = (await readdir(imageDir)).filter((file) => /-\d+\.png$/.test(file)).sort();
for (const file of files) {
  const input = path.join(imageDir, file);
  const { width, height } = await sharp(input).metadata();
  const variants = [];
  for (const size of [...new Set([384, 640, width].filter((size) => size <= width))]) {
    const buffer = await sharp(input).resize({ width: size }).webp({ quality: 85, effort: 6 }).toBuffer();
    const hash = createHash("sha256").update(buffer).digest("hex").slice(0, 12);
    const name = `${path.parse(file).name}-${size}-${hash}.webp`;
    await writeFile(path.join(outputDir, name), buffer);
    variants.push({ src: `/images/optimized/${name}`, width: size });
  }
  manifest[`/images/${file}`] = {
    width,
    height,
    src: variants.at(-1).src,
    srcSet: variants.map(({ src, width }) => `${src} ${width}w`).join(", "),
  };
}

await writeFile(path.join(root, "src/app/lib/project-images.json"), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Generated responsive WebP images for ${files.length} project screenshots.`);
