// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import optimizeImages from "./src/integrations/optimize-images.ts";

export default defineConfig({
  site: "https://retreats-in-oesterreich.at",
  output: "static",
  trailingSlash: "always",
  integrations: [
    sitemap({
      // Danke-Seite nach Warteliste-Anmeldung gehört nicht in den Index
      filter: (page) => !page.endsWith("/warteliste-danke/"),
    }),
    // WebP-Varianten + srcset für Bilder aus public/images/ (nur im Build).
    // Stufenweise: minSize senken, um mehr Bilder einzubeziehen (0 = alle).
    optimizeImages({ minSize: 300 * 1024 }),
  ],
  redirects: {
    // Jekyll-Pagination-Relikt: /page/2/ existierte auf der alten Site
    "/page/2/": "/",
  },
});
