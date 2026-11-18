/**
 * Build step: responsive WebP variants for images from public/images/.
 *
 * Runs after the build over all HTML pages in dist/. Every
 * `<img src="/images/…">` of at least `minSize` gets:
 *   - `srcset` with WebP variants (400, 800, 1200 px + original width),
 *   - `sizes`, `width`/`height` (original dimensions → no layout shift,
 *     layout stays identical to before),
 *   - `data-zoom-src` = full-resolution WebP for the lightbox.
 *
 * `src` keeps the original JPEG at its existing URL (SEO, emails, social
 * previews). Variants go to dist/images/_opt/ and are cached in
 * node_modules/.astro/.
 */
import type { AstroIntegration } from "astro";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import {
  copyFile,
  mkdir,
  readdir,
  readFile,
  stat,
  writeFile,
} from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

interface Options {
  /** Only optimize images of at least this file size (bytes). 0 = all. */
  minSize?: number;
  /** Target widths of the variants; widths above the original are skipped. */
  widths?: number[];
  /** WebP quality (0–100). */
  quality?: number;
}

const IMG_TAG = /<img\b(?:[^>"']|"[^"]*"|'[^']*')*>/gi;
const ATTR = /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
const RASTER = /\.(jpe?g|png)$/i;
// Fallback for browsers without `sizes="auto"`: the widest rendered size
// is about 900 px (desktop gallery), full width on phones.
const SIZES_FALLBACK = "(max-width: 768px) 100vw, 900px";

interface Variant {
  width: number;
  url: string;
}
interface Processed {
  width: number;
  height: number;
  variants: Variant[];
}

function parseAttrs(tag: string): Map<string, string> {
  const attrs = new Map<string, string>();
  const inner = tag.replace(/^<img\b/i, "").replace(/\/?>$/, "");
  for (const m of inner.matchAll(ATTR)) {
    attrs.set(m[1]!.toLowerCase(), m[2] ?? m[3] ?? m[4] ?? "");
  }
  return attrs;
}

function decodeSrc(src: string): string {
  const unescaped = src.replace(/&amp;/g, "&");
  try {
    return decodeURI(unescaped);
  } catch {
    return unescaped;
  }
}

async function* htmlFiles(dir: string): AsyncGenerator<string> {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(full);
    else if (entry.name.endsWith(".html")) yield full;
  }
}

export default function optimizeImages(
  options: Options = {},
): AstroIntegration {
  const minSize = options.minSize ?? 0;
  const widths = options.widths ?? [400, 800, 1200];
  const quality = options.quality ?? 80;

  let publicDir = "";
  let cacheDir = "";

  return {
    name: "optimize-images",
    hooks: {
      "astro:config:done": ({ config }) => {
        publicDir = fileURLToPath(config.publicDir);
        cacheDir = fileURLToPath(new URL("optimize-images/", config.cacheDir));
      },
      "astro:build:done": async ({ dir, logger }) => {
        const distDir = fileURLToPath(dir);

        const cache = new Map<string, Promise<Processed | null>>();
        let originalBytes = 0;
        let variantBytes = 0;

        async function process(src: string): Promise<Processed | null> {
          // Strip fragment/query (e.g. the theme's "#wide" marker for wide images)
          const rel = decodeSrc(src).replace(/[?#].*$/, "");
          if (!rel.startsWith("/images/") || !RASTER.test(rel)) return null;
          const file = path.join(publicDir, rel);
          if (!existsSync(file)) return null;
          const { size } = await stat(file);
          if (size < minSize) return null;

          const buffer = await readFile(file);
          const hash = createHash("sha1")
            .update(buffer)
            .digest("hex")
            .slice(0, 8);
          const meta = await sharp(buffer).metadata();
          // Respect EXIF rotation (portrait phone photos)
          const rotated = (meta.orientation ?? 1) >= 5;
          const width = (rotated ? meta.height : meta.width) ?? 0;
          const height = (rotated ? meta.width : meta.height) ?? 0;
          if (!width || !height) return null;

          const targets = [
            ...new Set([...widths.filter((w) => w < width), width]),
          ];
          const parsed = path.posix.parse(rel);
          const outDir = path.posix.join(
            "/images/_opt",
            parsed.dir.replace(/^\/images\/?/, ""),
          );
          const variants: Variant[] = [];

          for (const w of targets) {
            const name = `${parsed.name}.${hash}-${w}.webp`;
            const cached = path.join(cacheDir, `${hash}-${w}-q${quality}.webp`);
            const out = path.join(distDir, outDir, name);
            if (!existsSync(cached)) {
              await mkdir(cacheDir, { recursive: true });
              const data = await sharp(buffer)
                .rotate()
                .resize({ width: w, withoutEnlargement: true })
                .webp({ quality })
                .toBuffer();
              await writeFile(cached, data);
            }
            await mkdir(path.dirname(out), { recursive: true });
            await copyFile(cached, out);
            variantBytes += (await stat(out)).size;
            variants.push({
              width: w,
              url: encodeURI(path.posix.join(outDir, name)),
            });
          }
          originalBytes += size;
          return { width, height, variants };
        }

        let pages = 0;
        let tags = 0;
        for await (const file of htmlFiles(distDir)) {
          const html = await readFile(file, "utf8");
          const matches = [...html.matchAll(IMG_TAG)];
          if (matches.length === 0) continue;

          const replacements = await Promise.all(
            matches.map(async ([tag]) => {
              const attrs = parseAttrs(tag);
              const src = attrs.get("src");
              if (!src || attrs.has("srcset")) return tag;
              if (!cache.has(src)) cache.set(src, process(src));
              const result = await cache.get(src)!;
              if (!result) return tag;

              const srcset = result.variants
                .map((v) => `${v.url} ${v.width}w`)
                .join(", ");
              const lazy = attrs.get("loading") === "lazy";
              // "#wide" images span the full viewport width
              const sizes =
                attrs.get("sizes") ??
                (src.endsWith("#wide") ? "100vw" : SIZES_FALLBACK);
              const extra = [
                `srcset="${srcset}"`,
                `sizes="${lazy ? "auto, " : ""}${sizes}"`,
                attrs.has("width") || attrs.has("height")
                  ? ""
                  : `width="${result.width}" height="${result.height}"`,
                `data-zoom-src="${result.variants.at(-1)!.url}"`,
              ]
                .filter(Boolean)
                .join(" ");
              tags++;
              // An existing sizes attribute is reused above and replaced here
              return tag
                .replace(/\s+sizes\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/i, "")
                .replace(/\s*\/?>$/, ` ${extra}>`);
            }),
          );

          let i = 0;
          const updated = html.replace(IMG_TAG, () => replacements[i++]!);
          if (updated !== html) {
            await writeFile(file, updated);
            pages++;
          }
        }

        const images = [...cache.values()].length;
        const done = (await Promise.all(cache.values())).filter(Boolean).length;
        logger.info(
          `optimized ${done}/${images} images (from ${Math.round(minSize / 1024)} KB), ` +
            `${tags} <img> on ${pages} pages. Originals ${(originalBytes / 1e6).toFixed(1)} MB, ` +
            `all WebP variants ${(variantBytes / 1e6).toFixed(1)} MB.`,
        );
      },
    },
  };
}
