import { defineCollection, defineContentConfig, z } from '@nuxt/content'

const listItemSchema = z.object({
  name: z.string(),
  detail: z.string().optional(),
  note: z.string().optional(),
  link: z.string().optional(),
})

const listGroupSchema = z.object({
  name: z.string(),
  items: z.array(listItemSchema),
})

const listSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  intro: z.string().optional(),
  updatedAt: z.string().optional(),
  tags: z.array(z.string()).optional(),
  groups: z.array(listGroupSchema),
})

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
    lists: defineCollection({
      type: 'data',
      source: '**/*.json',
      schema: listSchema,
    }),
  },
})
