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

  if (query.userId && typeof query.userId === 'string') {
    const personalizedNaming = await prisma.personalizedNamingScheme.findFirst({
      where: {
        lobbyId: lobby.id,
        memberId: query.userId
      }
    });

    if (personalizedNaming) {
      lobby.namingScheme = personalizedNaming.pattern;
    }
  }

  return lobby;
});