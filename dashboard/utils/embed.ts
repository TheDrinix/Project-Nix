import { z } from 'zod';

export const embedFieldSchema = z.object({
  id: z.string().uuid().or(z.string().optional()),
  name: z.string().max(256).optional(),
  value: z.string().max(1024).optional(),
  inline: z.boolean().optional()
}).refine(data => {
  return !!data.name || !!data.value;
}, {
  message: 'Field name or content must be at least 1 character',
  path: ['name', 'value']
})

export const embedSchema = z.object({
  title: z.string().max(100, 'Title must be at most 50 characters').optional(),
  url: z.string().url('Invalid title URL').or(z.string().optional()),
  description: z.string().max(1024, 'Description must be at most 1024 characters').optional(),
  color: z.number().int().min(0, 'Invalid hex color').max(0xFFFFFF, 'Invalid hex color'),
  timestamp: z.string().optional(),
  author: z.object({
    name: z.string().max(256, 'Author name must be at most 256 characters').optional(),
    icon_url: z.enum(['{user_avatar}', '{guild_icon}']).optional()
      .or(z.string().length(0))
      .or(z.string().url('Invalid author icon url'))
  })
    .refine(data => (!(!!data.icon_url && !data.name)), {
      message: 'Author name must be at least 1 character',
      path: ['name']
    }),
  footer: z.object({
    text: z.string().max(200, 'Footer text must be at most 200 characters').optional(),
    icon_url: z
      .enum(['{user_avatar}', '{guild_icon}']).optional()
      .or(z.string().length(0))
      .or(z.string().url('Invalid footer icon url'))
  }),
  fields: z.array(embedFieldSchema).default([]),
  image: z.object({
    url: z
      .enum(['{user_avatar}', '{guild_icon}']).optional()
      .or(z.string().length(0))
      .or(z.string().url('Invalid image URL'))
  }),
  thumbnail: z.object({
    url: z
      .enum(['{user_avatar}', '{guild_icon}']).optional()
      .or(z.string().length(0))
      .or(z.string().url('Invalid thumbnail URL'))
  }),
});

export type Embed = z.infer<typeof embedSchema>;
export type EmbedField = z.infer<typeof embedFieldSchema>;