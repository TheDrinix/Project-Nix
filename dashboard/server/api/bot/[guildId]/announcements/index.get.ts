import prisma from "~/lib/prisma";

export default defineEventHandler(async (event) => {
  const guildId = getRouterParam(event, 'guildId');

  if (!guildId) {
    return createError({
      statusCode: 400,
      statusMessage: 'Missing guildId',
    });
  }

  const announcementsConfig = await prisma.annoucementsConfig.findFirst({
    where: {
      guildId: guildId,
    }
  });

  if (!announcementsConfig) {
    return createError({
      statusCode: 404,
      statusMessage: 'Announcements config not found',
    });
  }
  
  return announcementsConfig;
})