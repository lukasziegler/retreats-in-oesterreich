// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://retreats-in-oesterreich.at",
  output: "static",
  trailingSlash: "always",
  integrations: [
    sitemap({
      // Danke-Seite nach Warteliste-Anmeldung gehört nicht in den Index
      filter: (page) => !page.endsWith("/warteliste-danke/"),
    }),
  ],
  redirects: {
    // Jekyll-Pagination-Relikt: /page/2/ existierte auf der alten Site
    "/page/2/": "/",
  },
});
