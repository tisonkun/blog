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

const trailListenItemSchema = z.union([
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
        credit: z.string().optional(),
        wiki: z.url().optional(),
        listen: z.union([trailListenItemSchema, z.array(trailListenItemSchema)]).optional(),
        draft: z.boolean().optional(),
    }),
});

export const collections = {
    posts: postCollection,
    trails: trailCollection,
};
