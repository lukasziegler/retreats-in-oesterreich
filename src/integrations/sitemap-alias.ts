/**
 * Also serves the sitemap at /sitemap.xml.
 *
 * @astrojs/sitemap always writes `sitemap-index.xml`; the old Jekyll site
 * used `/sitemap.xml` (registered in Google Search Console). This step
 * copies the index to the old name after the build so the URL stays
 * stable. Must come AFTER sitemap() in astro.config.mjs.
 */
import type { AstroIntegration } from "astro";
import { copyFile } from "node:fs/promises";

export default function sitemapAlias(): AstroIntegration {
  return {
    name: "sitemap-alias",
    hooks: {
      "astro:build:done": async ({ dir, logger }) => {
        await copyFile(
          new URL("sitemap-index.xml", dir),
          new URL("sitemap.xml", dir),
        );
        logger.info("copied sitemap-index.xml → sitemap.xml");
      },
    },
  };
}
