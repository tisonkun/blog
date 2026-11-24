import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const postCollection = defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
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

export const collections = {
    posts: postCollection,
};
