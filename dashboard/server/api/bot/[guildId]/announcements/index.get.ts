import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const guildId = getRouterParam(event, 'guildId');

  const query = getQuery(event);

  const selection = query.selection;

  if (!guildId) {
    return createError({
      statusCode: 400,
      statusMessage: 'Missing guildId',
    });
  }


  let select: any;
  switch (selection) {
    case 'join':
      select = {
        announceJoin: true,
        joinMessageEmbed: true,
        channelId: true
      }
      break;
    case 'leave':
      select = {
        announceLeave: true,
        leaveMessageEmbed: true,
        channelId: true
      }
      break;
    case 'ban':
      select = {
        announceBan: true,
        banMessageEmbed: true,
        channelId: true
      }
      break
    default:
      select = undefined;
  }

  const announcementsConfig = await prisma.announcementsConfig.findFirst({
    where: {
      guildId: guildId,
    },
    select
  });

  if (!announcementsConfig) {
    return createError({
      statusCode: 404,
      statusMessage: 'Announcements config not found',
    });
  }
  
  return announcementsConfig;
})