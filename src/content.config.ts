import { defineCollection, reference, z } from "astro:content";
import { glob } from "astro/loaders";

const retreats = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/retreats" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    /** Publish date; used for RSS and as fallback sort key. */
    date: z.coerce.date(),
    start_date: z.coerce.date(),
    end_date: z.coerce.date(),
    author: reference("authors").optional(),
    image: z.string().optional(),
    image_caption: z.string().optional(),
    /**
     * Additional images for the hero mosaic; `image` is always shown
     * first. More than 3 images in total → "+N" tile opening the gallery.
     */
    gallery: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    /** Externally hosted retreat: cards in the featured slider link out. */
    external_url: z.string().url().optional(),
    /**
     * Waitlist: undefined = automatic (past retreats only),
     * true = always (e.g. fully booked), "soon" = date fixed, booking not
     * open yet (interest list), false = never.
     */
    waitlist: z.union([z.boolean(), z.literal("soon")]).optional(),
    /**
     * Testimonial slider (Testimonials.astro). Placed where the markdown
     * contains `<div data-slot="testimonials"></div>`, otherwise after the
     * content.
     */
    testimonials: z
      .array(
        z.object({
          quote: z.string(),
          name: z.string().optional(),
          /** When, as shown, e.g. "Mai 2025". */
          date: z.string().optional(),
        }),
      )
      .default([]),
    /**
     * Booking call-to-action (BookingBlock.astro), shown instead of the
     * waitlist once the retreat is bookable (no `waitlist` set).
     */
    booking: z
      .object({
        url: z.string().url(),
        /** Button text; default from settings.ts. */
        label: z.string().optional(),
        /** Short conversion text; default from settings.ts. */
        text: z.string().optional(),
        /** Selling points with check marks, e.g. cancellation terms. */
        highlights: z.array(z.string()).default([]),
      })
      .optional(),
    /** Overrides the default slider title from settings.ts. */
    testimonials_title: z.string().optional(),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/pages" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    /** URL path, e.g. "/impressum/" — kept identical to the Jekyll site. */
    permalink: z.string(),
    image: z.string().optional(),
    image_caption: z.string().optional(),
  }),
});

const authors = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/authors" }),
  schema: z.object({
    username: z.string(),
    name: z.string(),
    image: z.string().optional(),
    website: z.string().url().optional(),
    instagram: z.string().url().optional(),
    facebook: z.string().url().optional(),
    twitter: z.string().url().optional(),
  }),
});

export const collections = { retreats, pages, authors };
