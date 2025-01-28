import prisma from "~/lib/prisma";

export default defineEventHandler(async event => {
  const guildId = getRouterParam(event, 'guildId');
  const lobbyId = getRouterParam(event, 'lobbyId');

  const lobby = await prisma.lobby.findFirst({
    where: {
      guildId: guildId,
      entryPointId: lobbyId
    }
  });

  if (!lobby) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Lobby not found'
    });
  }

  await prisma.lobby.delete({
    where: {
      guildId: guildId,
      entryPointId: lobbyId
    }
  });
});