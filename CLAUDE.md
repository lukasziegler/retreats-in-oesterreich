# CLAUDE.md

Statische Website „Retreats in Österreich" (retreats-in-oesterreich.at) — Astro 7, TypeScript strict, Vanilla-CSS mit Design-Tokens, keine UI-Frameworks, keine Client-Dependencies. Deployt auf GitHub Pages. Sprache der Site und der Inhalte: Deutsch (`lang="de-AT"`).

## Befehle

```sh
npm run dev       # Dev-Server (Port 4321)
npm run build     # Build nach dist/
npm run check     # astro check — vor jedem Commit laufen lassen
npm run format    # Prettier (mit prettier-plugin-astro)
```

## Architektur

- **Content Collections** ([src/content.config.ts](src/content.config.ts)):
  - `retreats` — ein Retreat pro Markdown-Datei, Dateiname = URL-Slug (Root-Level: `/slug/`). Frontmatter: `title`, `description`, `date` (Publish-Datum, für RSS/Sortierung), `start_date`/`end_date` (Event-Zeitraum), `author` (Referenz auf authors), `image`, `tags`, `featured`, `external_url` (extern gehostete Retreats).
  - `pages` — statische Seiten, URL kommt aus `permalink` im Frontmatter (weicht teils vom Dateinamen ab, z.B. `frauenkreise.md` → `/for-women/`).
  - `authors` — Veranstalter-Profile, Dateiname = `username` = URL-Slug.
- **Routing**: [src/pages/[...slug].astro](src/pages/[...slug].astro) bedient alle drei Collections auf Root-Ebene und dispatcht auf `RetreatPage`/`ContentPage`/`AuthorPage`. Sonderrouten: `kontakt.astro` (Formspree-Formular), `team.astro` (Autoren-Grid), `tags/index.astro` (zeigt Sektion via `?tag=`-Query), `feed.xml.ts`, `search.json.ts`.
- **Settings**: Navigation, Hero, Mailchimp, Formspree, GTM-ID → [src/data/settings.ts](src/data/settings.ts). Keine Settings in Komponenten hardcoden.
- **Datums-Logik** ([src/utils/retreats.ts](src/utils/retreats.ts)): `upcoming`/`past` teilen anhand `end_date >= heute`. Die Startseite und der Featured-Slider filtern damit zur Build-Zeit — deshalb baut der Deploy-Workflow wöchentlich per Cron neu. Vergangene Retreats nie manuell löschen/deaktivieren, das Archiv übernimmt das.
- **Client-Skripte** ([src/scripts/](src/scripts/)): dependency-freies TS — Menü, Such-Overlay (Index von `/search.json`), Scroll-Snap-Slider, Bild-Zoom, Cookie-Consent. Einstieg: `initSite()` aus `main.ts`, eingebunden im BaseLayout.

## Styling

- [src/styles/tokens.css](src/styles/tokens.css) = Design-Tokens (Farben, Typo, Abstände als Custom Properties). [src/styles/global.css](src/styles/global.css) = alle Komponenten-Styles, gegliedert nach Modulen, natives CSS-Nesting.
- Der Look ist ein behutsam modernisierter Port des Jekyll-Themes „Dann". BEM-artige Klassennamen (`.article__title`) beibehalten — die Markdown-Inhalte referenzieren Klassen wie `button button--primary` und `gallery-box` direkt.
- Breakpoints: 1300 / 1050 (Menü) / 1024 / 768 / 576 px. Grid: nur die tatsächlich genutzten `col-*`-Klassen sind definiert.
- Icons: inline SVG über [src/components/Icon.astro](src/components/Icon.astro) — keine Icon-Fonts einführen.
- Schrift: Mulish, self-hosted via @fontsource (DSGVO — keine Google-Fonts-CDN-Links einbauen).

## Constraints

- **URLs sind SEO-kritisch** und müssen stabil bleiben: Retreats/Autoren auf Root-Ebene, `trailingSlash: 'always'`, Bilder unter `/images/…` (deshalb liegen sie in `public/`, nicht in `src/assets/`).
- **GTM/Analytics** lädt nur nach Cookie-Zustimmung (`cookie-consent.ts`); aktiviert über `googleTagManagerId` in settings.ts (aktuell `null` = aus, kein Banner).
- Retreat-Detailseiten rendern **JSON-LD Event-Schema** (in `RetreatPage.astro`) — bei Schema-Änderungen die Frontmatter-Felder synchron halten.
- Neue Bilder vor dem Commit web-optimieren (max. ~1800px, JPEG q80–85).
