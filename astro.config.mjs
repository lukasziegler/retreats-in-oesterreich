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
      // Danke-Seite nach Warteliste-Anmeldung gehört nicht in den Index
      filter: (page) => !page.endsWith("/warteliste-danke/"),
    }),
    // Index zusätzlich als /sitemap.xml (alte Jekyll-URL), nach sitemap()
    sitemapAlias(),
    // WebP-Varianten + srcset für Bilder aus public/images/ (nur im Build).
    // minSize: nur Bilder ab dieser Dateigröße (Bytes) optimieren, 0 = alle.
    optimizeImages({ minSize: 0 }),
  ],
  redirects: {
    // Jekyll-Pagination-Relikt: /page/2/ existierte auf der alten Site
    "/page/2/": "/",
    // Mesnerhof-Retreats 2025 → Folgetermine 2027 (Dateien umbenannt)
    "/yoga-mesnerhof-november/": "/yoga-mesnerhof-juni/",
    "/yoga-mesnerhof-dezember/": "/yoga-mesnerhof-august/",
  },
});
