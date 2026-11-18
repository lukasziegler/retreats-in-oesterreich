// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import optimizeImages from "./src/integrations/optimize-images.ts";
import sitemapAlias from "./src/integrations/sitemap-alias.ts";

export default defineConfig({
  site: "https://retreats-in-oesterreich.at",
  output: "static",
  trailingSlash: "always",
  integrations: [
    sitemap({
      // Keep the waitlist thank-you page out of the index
      filter: (page) => !page.endsWith("/warteliste-danke/"),
    }),
    // Also serve the index as /sitemap.xml (old Jekyll URL); must come after sitemap()
    sitemapAlias(),
    // WebP variants + srcset for images in public/images/ (build only).
    // minSize: only optimize images at least this many bytes, 0 = all.
    optimizeImages({ minSize: 0 }),
  ],
  redirects: {
    // Jekyll pagination leftover: /page/2/ existed on the old site
    "/page/2/": "/",
    // Mesnerhof retreats 2025 → follow-up dates 2027 (files renamed)
    "/yoga-mesnerhof-november/": "/yoga-mesnerhof-juni/",
    "/yoga-mesnerhof-dezember/": "/yoga-mesnerhof-august/",
  },
});
