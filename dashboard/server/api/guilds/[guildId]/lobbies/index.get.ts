import prisma from '~/lib/prisma';

export default defineEventHandler(async (event) => {
  await requireUserSession(event);

  const guildId = getRouterParam(event, 'guildId');

  if (!guildId) {
    throw createError({
      message: 'Guild ID is required',
      status: 400
    });
  }

  return  prisma.lobby.findMany({
    where: {
      guildId
    }
  });
})