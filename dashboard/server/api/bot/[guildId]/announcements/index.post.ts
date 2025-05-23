import prisma from "~/lib/prisma";
import { z } from 'zod';

const annoucementsConfigSchema = z.object({
  channelId: z.string().optional(),
  announceJoin: z.boolean().default(true),
  announceLeave: z.boolean().default(true),
  announceBan: z.boolean().default(false),
}) 

export default defineEventHandler(async (event) => {
  const guildId = getRouterParam(event, 'guildId');

  if (!guildId) {
    return createError({
      statusCode: 400,
      statusMessage: 'Missing guildId',
    });
  }

  const res = await readValidatedBody(event, b => annoucementsConfigSchema.safeParse(b));

  if (!res.success) {
    throw createError({
      statusCode: 400,
      name: 'Invalid request body',
      message: res.error.errors.map(err => err.message).join('\n')
    });
  }

  const { channelId, announceJoin, announceLeave, announceBan } = res.data;

  if (!channelId) {
    await prisma.announcementsConfig.delete({
      where: {
        guildId: guildId,
      }
    }).catch((e) => {
      if (e.code === 'P2025') {
        // Ignore error if the config does not exist
        return;
      }
      throw e;
    });

    setResponseStatus(event, 204);
    return;
  }

  const announcementsConfig = await prisma.announcementsConfig.upsert({
    where: {
      guildId: guildId,
    },
    create: {
      guildId: guildId,
      channelId: channelId,
      announceJoin: announceJoin,
      announceLeave: announceLeave,
      announceBan: announceBan,
    },
    update: {
      channelId: channelId,
      announceJoin: announceJoin,
      announceLeave: announceLeave,
      announceBan: announceBan,
    }
  });

  return announcementsConfig;
});