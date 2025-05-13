import { JsonValue } from "@prisma/client/runtime/library";
import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const guildId = getRouterParam(event, 'guildId');

  const query = getQuery(event);

  const selection = query.select;

  if (!guildId) {
    return createError({
      statusCode: 400,
      statusMessage: 'Missing guildId',
    });
  }

  const announcementsConfig = await prisma.announcementsConfig.findFirst({
    where: {
      guildId: guildId,
    },
  });

  if (!announcementsConfig) {
    return createError({
      statusCode: 404,
      statusMessage: 'Announcements config not found',
    });
  }

  let res: { messageTemplate: JsonValue; channelId: String; } | undefined;

  switch (selection) {
    case 'join':
      if (announcementsConfig.announceJoin) {
        res = {
          messageTemplate: announcementsConfig.joinMessageEmbed,
          channelId: announcementsConfig.channelId
        }
      }
      break;
    case 'leave':
      if (announcementsConfig.announceLeave) {
        res = {
          messageTemplate: announcementsConfig.leaveMessageEmbed,
          channelId: announcementsConfig.channelId
        }
      }
      break;
    case 'ban':
      if (announcementsConfig.announceBan) {
        res = {
          messageTemplate: announcementsConfig.banMessageEmbed,
          channelId: announcementsConfig.channelId
        }
      }
      break;
  }

  if (!res) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Announcements config not found',
    })
  }

  return res;
})