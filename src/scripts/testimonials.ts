/**
 * Testimonial slider (Testimonials.astro): the track is a native
 * scroll-snap container (touch swipe, trackpad, keyboard). This adds
 * arrows, the progress bar, the counter, the active slide state, click on a
 * neighbouring slide to go there and mouse drag on desktop.
 */

const DRAG_THRESHOLD = 5;
const DRAG_SWITCH = 40;

function initOne(root: HTMLElement): void {
  const track = root.querySelector<HTMLElement>(".testimonials__track");
  const slides = track
    ? Array.from(track.querySelectorAll<HTMLElement>(".testimonial"))
    : [];
  if (!track || slides.length < 2) return;

  const bar = root.querySelector<HTMLElement>(".testimonials__progress-bar");
  const current = root.querySelector<HTMLElement>(
    "[data-testimonials-current]",
  );
  const prev = root.querySelector<HTMLButtonElement>(
    "[data-testimonials-prev]",
  );
  const next = root.querySelector<HTMLButtonElement>(
    "[data-testimonials-next]",
  );
  const total = slides.length;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let active = -1;

  function update(): void {
    const max = track!.scrollWidth - track!.clientWidth;
    const progress = max > 0 ? Math.min(1, track!.scrollLeft / max) : 0;
    // Bar grows continuously while swiping: one segment per slide
    bar?.style.setProperty(
      "--progress",
      String((1 + progress * (total - 1)) / total),
    );

    const index = Math.round(progress * (total - 1));
    if (index === active) return;
    active = index;
    slides.forEach((slide, i) =>
      slide.classList.toggle("is-active", i === index),
    );
    if (current) current.textContent = String(index + 1).padStart(2, "0");
    if (prev) prev.disabled = index === 0;
    if (next) next.disabled = index === total - 1;
  }

  function goTo(index: number): void {
    const slide = slides[Math.max(0, Math.min(total - 1, index))];
    // Center the slide; scroll-snap corrects the rest (mobile snaps to start)
    const left =
      slide.offsetLeft - (track!.clientWidth - slide.offsetWidth) / 2;
    track!.scrollTo({
      left,
      behavior: reducedMotion.matches ? "auto" : "smooth",
    });
  }

  prev?.addEventListener("click", () => goTo(active - 1));
  next?.addEventListener("click", () => goTo(active + 1));

  // Click/tap on a neighbouring slide brings it to the front
  slides.forEach((slide, i) =>
    slide.addEventListener("click", () => {
      if (i !== active) goTo(i);
    }),
  );

  // Mouse drag (touch and trackpads scroll natively)
  let startX = 0;
  let startScroll = 0;
  let startIndex = 0;
  let pressed = false;
  let dragged = false;

  track.addEventListener("pointerdown", (event) => {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    event.preventDefault(); // no text selection while dragging
    pressed = true;
    dragged = false;
    startX = event.clientX;
    startScroll = track.scrollLeft;
    startIndex = active;
  });

  window.addEventListener("pointermove", (event) => {
    if (!pressed) return;
    const dx = event.clientX - startX;
    if (!dragged && Math.abs(dx) > DRAG_THRESHOLD) {
      dragged = true;
      root.classList.add("is-dragging"); // disables scroll-snap
    }
    if (dragged) track.scrollLeft = startScroll - dx;
  });

  window.addEventListener("pointerup", (event) => {
    if (!pressed) return;
    pressed = false;
    if (!dragged) return;

    const dx = event.clientX - startX;
    const step = Math.abs(dx) > DRAG_SWITCH ? (dx < 0 ? 1 : -1) : 0;
    goTo(startIndex + step);

    // Re-enable snapping only after the smooth scroll has settled
    const done = (): void => root.classList.remove("is-dragging");
    track.addEventListener("scrollend", done, { once: true });
    setTimeout(done, 800);
  });

  // A drag must not count as a click on a slide
  track.addEventListener(
    "click",
    (event) => {
      if (!dragged) return;
      dragged = false;
      event.stopPropagation();
    },
    true,
  );

  let frame = 0;
  track.addEventListener(
    "scroll",
    () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    },
    { passive: true },
  );
  window.addEventListener("resize", update);

  root.classList.add("is-ready");
  update();
}

export function initTestimonials(): void {
  document
    .querySelectorAll<HTMLElement>("[data-testimonials]")
    .forEach(initOne);
}
