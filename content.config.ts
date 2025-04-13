import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    content: defineCollection({
      type: 'page',
      source: '**/*.md',
      schema: z.object({
        description: z.string().optional(),
        tags: z.array(z.string()),
        createdAt: z.date(),
        updatedAt: z.date(),
      }),
    }),
  },
})
