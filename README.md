# Retreats in Österreich

Website des Projekts [retreats-in-oesterreich.at](https://retreats-in-oesterreich.at) von [Lukas Ziegler](https://lukasziegler.com/). Die Vision: Retreats in Österreich leichter auffindbar machen und Retreat-Organisatoren bei der Orga-Arbeit unterstützen.

Gebaut mit [Astro 7](https://astro.build) als statische Site, deployt auf GitHub Pages. Das Design basiert auf dem Jekyll-Theme „Dann" von [Artem Sheludko](https://jekyllthemes.io/developers/artem-sheludko) und wurde bei der Migration zu Astro behutsam modernisiert (2026).

## Entwicklung

Benötigt Node.js (Version siehe [.node-version](.node-version), z.B. via [fnm](https://github.com/Schniz/fnm)).

```sh
npm install
npm run dev       # Dev-Server auf http://localhost:4321
npm run build     # Production-Build nach dist/
npm run preview   # gebaute Site lokal testen
npm run check     # TypeScript-/Template-Prüfung
npm run format    # Prettier
```

## Inhalte pflegen

Alle Inhalte liegen als Markdown in `src/content/`:

- **`retreats/`** — ein Retreat pro Datei. Der Dateiname ist die URL (`handpan-retreat-2027.md` → `/handpan-retreat-2027/`). Retreats mit `end_date` in der Vergangenheit wandern automatisch in „Bisherige Retreats"; `featured: true` zeigt sie im Slider der Startseite. `external_url` verlinkt Karten im Slider nach außen.
- **`pages/`** — statische Seiten, URL über `permalink` im Frontmatter.
- **`authors/`** — Veranstalter-Profile (verlinkt über das `author`-Feld der Retreats).

Navigation, Hero-Text, Mailchimp, Formspree & Co. sind zentral in [src/data/settings.ts](src/data/settings.ts) konfiguriert.

## Deployment

Der Workflow [.github/workflows/deploy.yml](.github/workflows/deploy.yml) baut bei jedem Push auf `main` und deployt auf GitHub Pages (dazu in den Repo-Settings unter *Pages* die Source „GitHub Actions" wählen). Ein wöchentlicher Cron-Build hält die datumsbasierte Archivierung aktuell, auch ohne Commits.

## Analytics

Google Tag Manager ist DSGVO-konform hinter einem Cookie-Consent-Banner implementiert, aber standardmäßig deaktiviert. Zum Aktivieren die GTM-ID in [src/data/settings.ts](src/data/settings.ts) (`googleTagManagerId`) eintragen.
