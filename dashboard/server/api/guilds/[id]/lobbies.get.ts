import prisma from '~/lib/prisma';

export default defineEventHandler(async (event) => {
  requireUserSession(event);

  const guildId = getRouterParam(event, 'id');

  if (!guildId) {
    throw createError({
      message: 'Guild ID is required',
      status: 400
    });
  }

  const lobbies = await prisma.lobby.findMany({
    where: {
      guildId
    }
  });

  return lobbies;
})