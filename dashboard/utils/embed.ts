import { z } from 'zod';

export const embedFieldSchema = z.object({
  id: z.string().uuid(),
  name: z.string().max(256).optional(),
  value: z.string().max(1024).optional(),
  inline: z.boolean().optional()
}).refine(data => {
  return !data.name && !!data.value;
}, {
  message: 'Field name or content must be at least 1 character',
  path: ['name', 'value']
})

export const embedSchema = z.object({
  title: z.string().max(100, 'Title must be at most 50 characters').optional(),
  titleUrl: z.string().url('Invalid title URL').optional(),
  description: z.string().max(1024, 'Description must be at most 1024 characters').optional(),
  color: z.number().int().min(0, 'Invalid hex color').max(0xFFFFFF, 'Invalid hex color'),
  timestamp: z.string().optional(),
  author: z.object({
    name: z.string().max(256, 'Author name must be at most 256 characters').optional(),
    iconUrl: z.string().url('Invalid author icon url').optional()
  })
    .refine(data => (!(!!data.iconUrl && !data.name)), {
      message: 'Author name must be at least 1 character',
      path: ['name']
    }),
  footer: z.object({
    text: z.string().max(200, 'Footer text must be at most 200 characters').optional(),
    iconUrl: z.string().url('Invalid footer icon url').optional()
  }),
  fields: z.array(embedFieldSchema).default([]),
  image: z.object({
    url: z.string().url('Invalid image URL').optional()
  }),
  thumbnail: z.object({
    url: z.string().optional().or(z.string().url('Invalid thumbnail URL'))
  }),
});

export type Embed = z.infer<typeof embedSchema>;
export type EmbedField = z.infer<typeof embedFieldSchema>;
