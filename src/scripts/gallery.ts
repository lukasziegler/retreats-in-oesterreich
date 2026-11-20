/**
 * Gallery dialog for the hero mosaic (HeroMosaic.astro): opens all images
 * of a retreat, with prev/next buttons, arrow keys and swipe.
 */

interface Slide {
  src: string;
  alt: string;
}

const SWIPE_THRESHOLD = 50;

function toSlide(img: HTMLImageElement): Slide {
  // Full-resolution WebP from the build step (optimize-images), otherwise
  // the original
  return {
    src: img.dataset.zoomSrc || img.getAttribute("src") || "",
    alt: img.alt,
  };
}

function initOne(root: HTMLElement): void {
  const dialog = root.querySelector<HTMLDialogElement>(".gallery-dialog");
  const image = dialog?.querySelector<HTMLImageElement>(
    ".gallery-dialog__image",
  );
  const counter = dialog?.querySelector<HTMLElement>(
    ".gallery-dialog__counter",
  );
  if (!dialog || !image || !counter) return;

  const tiles = root.querySelectorAll<HTMLButtonElement>(".mosaic__item");
  const rest = root.querySelector<HTMLTemplateElement>(
    "template[data-gallery-rest]",
  );
  const slides: Slide[] = [
    ...[...tiles].flatMap((tile) => {
      const img = tile.querySelector("img");
      return img ? [toSlide(img)] : [];
    }),
    ...[...(rest?.content.querySelectorAll("img") ?? [])].map(toSlide),
  ];
  if (slides.length === 0) return;

  let current = 0;
  let opener: HTMLElement | null = null;

  function show(index: number): void {
    current = (index + slides.length) % slides.length;
    const slide = slides[current]!;
    image!.src = slide.src;
    image!.alt = slide.alt;
    counter!.textContent = `${current + 1} / ${slides.length}`;
    // Preload the neighbours for instant navigation
    for (const offset of [1, -1]) {
      const neighbour =
        slides[(current + offset + slides.length) % slides.length]!;
      new Image().src = neighbour.src;
    }
  }

  tiles.forEach((tile) => {
    tile.addEventListener("click", () => {
      opener = tile;
      show(Number(tile.dataset.galleryIndex) || 0);
      dialog.showModal();
      document.documentElement.classList.add("zoom-is-visible");
    });
  });

  dialog.addEventListener("close", () => {
    document.documentElement.classList.remove("zoom-is-visible");
    opener?.focus();
  });

  dialog
    .querySelector("[data-gallery-close]")
    ?.addEventListener("click", () => dialog.close());
  dialog
    .querySelector("[data-gallery-prev]")
    ?.addEventListener("click", () => show(current - 1));
  dialog
    .querySelector("[data-gallery-next]")
    ?.addEventListener("click", () => show(current + 1));

  // Click next to the image closes, like the content image zoom
  dialog.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    if (target === dialog || target.matches(".gallery-dialog__figure")) {
      dialog.close();
    }
  });

  dialog.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") show(current - 1);
    else if (event.key === "ArrowRight") show(current + 1);
  });

  let startX: number | null = null;
  dialog.addEventListener("pointerdown", (event) => {
    if (event.pointerType !== "mouse") startX = event.clientX;
  });
  dialog.addEventListener("pointerup", (event) => {
    if (startX === null) return;
    const deltaX = event.clientX - startX;
    startX = null;
    if (Math.abs(deltaX) < SWIPE_THRESHOLD) return;
    show(deltaX < 0 ? current + 1 : current - 1);
  });
  dialog.addEventListener("pointercancel", () => {
    startX = null;
  });
}

export function initGallery(): void {
  document.querySelectorAll<HTMLElement>("[data-gallery]").forEach(initOne);
}
