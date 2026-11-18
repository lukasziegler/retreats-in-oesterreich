/**
 * Stellt die Sitemap zusätzlich unter /sitemap.xml bereit.
 *
 * @astrojs/sitemap schreibt immer `sitemap-index.xml`, die alte Jekyll-Site
 * hatte `/sitemap.xml` (in der Google Search Console hinterlegt). Dieser
 * Schritt kopiert den Index nach dem Build auf den alten Namen, damit die
 * URL stabil bleibt. Muss in astro.config.mjs NACH sitemap() stehen.
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
        logger.info("sitemap-index.xml → sitemap.xml kopiert");
      },
    },
  };
}
