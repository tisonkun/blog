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

const trailCollection = defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/trails' }),
    schema: z.object({
        title: z.string(),
        date: z.coerce.date(),
        kind: z.enum(['song', 'quote', 'reference']).default('reference'),
        credit: z.string().optional(),
        source: z.string().optional(),
        tags: z.array(z.string()).default([]),
        draft: z.boolean().optional(),
    }),
});

export const collections = {
    posts: postCollection,
    trails: trailCollection,
};
