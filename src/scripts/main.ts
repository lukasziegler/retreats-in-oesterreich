/**
 * Globale Interaktivität (Port von js/common.js, ohne Dependencies):
 * Menü, Such-Overlay, Featured-Slider-Pfeile, Bild-Zoom, Resize-Handling.
 */
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

/** Pfeil-Navigation für den Scroll-Snap-Slider (ersetzt tiny-slider). */
function initSlider(): void {
  const slider = document.querySelector<HTMLElement>(".posts-slider");
  const prev = document.querySelector<HTMLElement>(".slider-controls .prev");
  const next = document.querySelector<HTMLElement>(".slider-controls .next");
  if (!slider || !prev || !next) return;

  function cardWidth(): number {
    const card = slider?.querySelector<HTMLElement>(".article");
    return card ? card.offsetWidth : (slider?.clientWidth ?? 0);
  }

  function updateControls(): void {
    if (!slider) return;
    const maxScroll = slider.scrollWidth - slider.clientWidth - 1;
    prev?.setAttribute("aria-disabled", String(slider.scrollLeft <= 0));
    next?.setAttribute("aria-disabled", String(slider.scrollLeft >= maxScroll));
  }

  function scrollBy(direction: 1 | -1): void {
    slider?.scrollBy({ left: direction * cardWidth(), behavior: "smooth" });
  }

  function bind(el: HTMLElement, direction: 1 | -1): void {
    el.addEventListener("click", () => scrollBy(direction));
    el.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        scrollBy(direction);
      }
    });
  }

  bind(prev, -1);
  bind(next, 1);
  slider.addEventListener("scroll", updateControls, { passive: true });
  updateControls();
}

/** Klick-Zoom für Inhaltsbilder (ersetzt Lightense). */
function initImageZoom(): void {
  const selector =
    ".post__content img:not(.no-zoom), .page__content img:not(.no-zoom), .gallery img";

  // Verlinkte Bilder nicht zoomen (Link hat Vorrang)
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
    clone.src = target.currentSrc || target.src;
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

/** Transitions während des Resizens unterdrücken. */
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
  initSlider();
  initImageZoom();
  initResizeStopper();
}
