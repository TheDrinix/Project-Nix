import { z } from "zod";
import prisma from "~/lib/prisma";

const announcementsToggleSchema = z.object({
  type: z.enum(['join', 'leave', 'ban']),
  enabled: z.boolean(),
})

export default defineEventHandler(async (event) => {
  requireUserSession(event);

  const guildId = getRouterParam(event, 'guildId');

  if (!guildId) {
    throw createError({
      message: 'Guild ID is required',
      status: 400,
    });
  }

  const body = await readValidatedBody(event, (b) => announcementsToggleSchema.safeParse(b));

  if (!body.success) {
    throw createError({
      message: 'Invalid request body',
      status: 400,
      data: body.error.flatten(),
    });
  }

  const { type, enabled } = body.data;

  const config = await prisma.announcementsConfig.findFirst({
    where: { guildId },
  });

  if (!config) {
    await createDefaultAnnouncementsConfig(guildId);
  }

  return prisma.announcementsConfig.update({
    where: { guildId },
    data: {
      [`announce${type.charAt(0).toUpperCase() + type.slice(1)}`]: enabled,
    },
  });
})
