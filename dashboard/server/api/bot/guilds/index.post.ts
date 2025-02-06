import { z } from 'zod';
import prisma from "~/lib/prisma";

const guildSchema = z.object({
  guildId: z.string(),
  name: z.string(),
});

export default defineEventHandler(async event => {
  const res = await readValidatedBody(event, body => guildSchema.safeParse(body));

  if (!res.success) {
    throw createError({
      status: 400,
      name: 'Invalid request body',
      message: res.error.errors.map(err => err.message).join('\n')
    });
  }

  return prisma.guild.create({
    data: {
      id: res.data.guildId,
      name: res.data.name
    }
  });
})