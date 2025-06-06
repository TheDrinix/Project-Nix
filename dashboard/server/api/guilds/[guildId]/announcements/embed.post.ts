import { z } from "zod"
import prisma from "~/lib/prisma";
import { createDefaultAnnouncementsConfig } from "~/server/utils/createDefaultAnnouncementsConfig";
import { embedSchema } from "~/utils/embed"

const embedUpdateSchema = z.object({
  type: z.enum(['join', 'leave', 'ban']),
  message: embedSchema
});

export default defineEventHandler(async (event) => {
  await requireUserSession(event);

  const guildId = getRouterParam(event, 'guildId');

  if (!guildId) {
    throw createError({
      message: 'Guild ID is required',
      status: 400,
    });
  }

  const body = await readValidatedBody(event, (b) => embedUpdateSchema.safeParse(b));

  if (!body.success) {
    throw createError({
      message: 'Invalid request body',
      status: 400,
      data: body.error.flatten(),
    });
  }

  const { type, message } = body.data;

  const config = await prisma.announcementsConfig.findFirst({
    where: { guildId },
  });

  if (!config) {
    await createDefaultAnnouncementsConfig(guildId);
  }
  
  return prisma.announcementsConfig.update({
    where: { guildId },
    data: {
      [`${type}MessageEmbed`]: message,
    },
  });
})
