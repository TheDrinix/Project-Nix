import prisma from "~/lib/prisma";

export default defineEventHandler(async event => {
  const guildId = getRouterParam(event, 'guildId');
  const lobbyId = getRouterParam(event, 'lobbyId');
  const query = getQuery(event);

  let where: {
    guildId: string | undefined;
    id: string | undefined;
  } | {
    guildId: string | undefined;
    entryPointId: string | undefined;
  };
  if (query.entrypoint) {
    where = {
      guildId: guildId,
      entryPointId: lobbyId,
    }
  } else {
    where = {
      guildId: guildId,
      id: lobbyId,
    }
  }

  const lobby = await prisma.lobby.findFirst({
    where
  });

  if (!lobby) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Lobby not found'
    });
  }

  return lobby;
});