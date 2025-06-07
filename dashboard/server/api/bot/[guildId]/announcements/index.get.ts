import { JsonValue } from "@prisma/client/runtime/library";
import prisma from "~/lib/prisma";

export default defineCachedEventHandler(async (event) => {
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

  let res: { messageTemplate: JsonValue; channelId: String | null; } | undefined;

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
}, {
  maxAge: 6 * 60 * 60,
  name: 'guild-announcements-config',
  getKey: (event) => {
    const guildId = getRouterParam(event, 'guildId');
    const query = getQuery(event) ?? '';
    return `${guildId}-${query.select}`;
  }
})