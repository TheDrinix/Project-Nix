import { z } from "zod";
import prisma from "~/lib/prisma";

const channelSchema = z.object({
  channelId: z.string().min(1, "Channel ID is required"),
});

export default defineEventHandler(async (event) => {
  requireUserSession(event);

  const guildId = getRouterParam(event, 'guildId');

  if (!guildId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Guild ID is required',
    });
  }

  const body = await readValidatedBody(event, (b) => channelSchema.safeParse(b));

  if (!body.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request body',
      data: body.error.flatten(),
    });
  }

  const { channelId } = body.data;

  const config = await prisma.announcementsConfig.findFirst({
    where: { guildId },
  });

  if (!config) {
    await createDefaultAnnouncementsConfig(guildId);
  }

  return prisma.announcementsConfig.update({
    where: { guildId },
    data: {
      channelId,
    },
  });
})
