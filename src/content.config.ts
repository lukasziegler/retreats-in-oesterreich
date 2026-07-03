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
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    /** Externally hosted retreat: cards in the featured slider link out. */
    external_url: z.string().url().optional(),
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
