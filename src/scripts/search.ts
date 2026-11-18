/**
 * Lightweight client-side search (replaces SimpleJekyllSearch, no dependencies).
 * Searches the /search.json index: every search term must appear in the title or tags.
 */

export interface SearchEntry {
  title: string;
  tags: string;
  url: string;
  image: string;
}

const LIMIT = 10;

function matches(entry: SearchEntry, query: string): boolean {
  const haystack = `${entry.title} ${entry.tags}`.toLowerCase();
  return query
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .every((word) => haystack.includes(word));
}

function resultHtml(entry: SearchEntry): string {
  const item = document.createElement("a");
  item.className = "search-results__item col col-6 col-m-12";
  item.href = entry.url;

  const imageBox = document.createElement("div");
  imageBox.className = "search-results__image";
  if (entry.image) {
    const img = document.createElement("img");
    img.src = entry.image;
    img.alt = entry.title;
    img.loading = "lazy";
    imageBox.appendChild(img);
  }

  const title = document.createElement("div");
  title.className = "search-results__title";
  title.textContent = entry.title;

  item.append(imageBox, title);
  return item.outerHTML;
}

export function initSearch(
  input: HTMLInputElement,
  resultsContainer: HTMLElement,
): void {
  let index: SearchEntry[] | null = null;

  async function loadIndex(): Promise<SearchEntry[]> {
    if (!index) {
      const response = await fetch("/search.json");
      index = (await response.json()) as SearchEntry[];
    }
    return index;
  }

  // Preload the index on focus so the first keystroke shows results right away
  input.addEventListener("focus", () => void loadIndex(), { once: true });

  input.addEventListener("input", async () => {
    const query = input.value.trim();
    if (!query) {
      resultsContainer.innerHTML = "";
      return;
    }
    const entries = await loadIndex();
    const results = entries
      .filter((entry) => matches(entry, query))
      .slice(0, LIMIT);
    resultsContainer.innerHTML = results.length
      ? results.map(resultHtml).join("")
      : '<h3 class="col no-results">No results found</h3>';
  });
}
