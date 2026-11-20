/**
 * Global interactivity (port of js/common.js, no dependencies):
 * menu, search overlay, "Mehr laden", image zoom, hero gallery, resize
 * handling.
 */
import { initGallery } from "./gallery";
import { initSearch } from "./search";

function initMenu(): void {
  const menuToggle = document.querySelector<HTMLElement>(".hamburger");
  const menuList = document.querySelector<HTMLElement>(".main-nav");

  menuToggle?.addEventListener("click", () => {
    const isOpen = menuToggle.classList.toggle("is-open");
    menuList?.classList.toggle("is-visible");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

function initSearchOverlay(): void {
  const html = document.documentElement;
  const globalWrap = document.querySelector<HTMLElement>(".global-wrap");
  const headerOverlay = document.querySelector<HTMLElement>(".header__overlay");
  const menuToggle = document.querySelector<HTMLElement>(".hamburger");
  const menuList = document.querySelector<HTMLElement>(".main-nav");
  const openButton = document.querySelector<HTMLElement>(".nav-button");
  const closeButton = document.querySelector<HTMLElement>(".search__close");
  const search = document.querySelector<HTMLElement>(".search");
  const searchInput = document.querySelector<HTMLInputElement>(".search__text");
  const resultsContainer = document.getElementById("js-results-container");

  if (!search) return;

  function open(): void {
    search?.classList.add("is-visible");
    html.classList.add("search-is-visible");
    globalWrap?.classList.add("is-active");
    headerOverlay?.classList.add("is-visible");
    menuToggle?.classList.remove("is-open");
    menuList?.classList.remove("is-visible");
    setTimeout(() => searchInput?.focus(), 250);
  }

  function close(): void {
    search?.classList.remove("is-visible");
    html.classList.remove("search-is-visible");
    globalWrap?.classList.remove("is-active");
    headerOverlay?.classList.remove("is-visible");
  }

  openButton?.addEventListener("click", open);
  closeButton?.addEventListener("click", close);
  headerOverlay?.addEventListener("click", close);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close();
  });

  if (searchInput && resultsContainer) {
    initSearch(searchInput, resultsContainer);
  }
}

/** "Mehr laden" in card grids (RetreatGrid.astro). */
function initLoadMore(): void {
  document.querySelectorAll<HTMLElement>("[data-load-more]").forEach((box) => {
    const button = box.querySelector<HTMLButtonElement>(".load-more__button");
    const step = Number(box.dataset.loadMore) || 6;
    if (!button) return;

    button.addEventListener("click", () => {
      const hidden = box.querySelectorAll<HTMLElement>(".article[hidden]");
      hidden.forEach((card, i) => {
        if (i < step) card.hidden = false;
      });
      if (hidden.length <= step) button.parentElement?.remove();
    });
  });
}

/** Click-to-zoom for content images (replaces Lightense). */
function initImageZoom(): void {
  const selector =
    ".post__content img:not(.no-zoom), .page__content img:not(.no-zoom), .gallery img";

  // Don't zoom linked images (the link wins)
  document.querySelectorAll<HTMLImageElement>(`${selector}`).forEach((img) => {
    if (img.closest("a")) img.classList.add("no-zoom");
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLImageElement) || !target.matches(selector))
      return;

    const overlay = document.createElement("div");
    overlay.className = "zoom-overlay";
    const clone = document.createElement("img");
    // Full resolution from the build step (optimize-images), otherwise
    // whatever is currently displayed
    clone.src = target.dataset.zoomSrc || target.currentSrc || target.src;
    clone.alt = target.alt;
    overlay.appendChild(clone);

    function closeZoom(): void {
      overlay.remove();
      document.documentElement.classList.remove("zoom-is-visible");
      document.removeEventListener("keydown", onKeydown);
    }
    function onKeydown(e: KeyboardEvent): void {
      if (e.key === "Escape") closeZoom();
    }

    overlay.addEventListener("click", closeZoom);
    document.addEventListener("keydown", onKeydown);
    document.body.appendChild(overlay);
    document.documentElement.classList.add("zoom-is-visible");
  });
}

/** Suppress transitions while resizing. */
function initResizeStopper(): void {
  let resizeTimer: ReturnType<typeof setTimeout>;
  window.addEventListener("resize", () => {
    document.body.classList.add("resize-animation-stopper");
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      document.body.classList.remove("resize-animation-stopper");
    }, 100);
  });
}

export function initSite(): void {
  initMenu();
  initSearchOverlay();
  initLoadMore();
  initImageZoom();
  initGallery();
  initResizeStopper();
}
