import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const postCollection = defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
    schema: z.object({
        title: z.string(),
        date: z.coerce.date(),
        description: z.string().optional(),
        category: z.string(),
        tags: z.array(z.string()).default([]),
        hidden: z.boolean().optional(),
        draft: z.boolean().optional(),
    }),
});

const trailLinkItemSchema = z.union([
    z.url(),
    z.object({
        label: z.string(),
        url: z.url(),
    }),
]);

const trailCollection = defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/trails' }),
    schema: z.object({
        date: z.coerce.date(),
        title: z.string().optional(),
        work: z.string().optional(),
        media: z.union([trailLinkItemSchema, z.array(trailLinkItemSchema)]).optional(),
        links: z.union([trailLinkItemSchema, z.array(trailLinkItemSchema)]).optional(),
        tags: z.array(z.string()).default([]),
        draft: z.boolean().optional(),
    }),
});

export const collections = {
    posts: postCollection,
    trails: trailCollection,
};
