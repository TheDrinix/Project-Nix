export default defineEventHandler(async event => {
  const guildId = getRouterParam(event, 'guildId');
  const lobbyId = getRouterParam(event, 'lobbyId');
  const query = getQuery(event);

  if (!guildId || !lobbyId) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Lobby not found'
    });
  }

  const where = query.entrypoint ? and(
    eq(tables.lobbies.guildId, guildId),
    eq(tables.lobbies.entryPointId, lobbyId)
  ) : and(
    eq(tables.lobbies.guildId, guildId),
    eq(tables.lobbies.id, lobbyId)
  );

  const lobby = await useDrizzle().query.lobbies.findFirst({
    where
  });

  if (!lobby) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Lobby not found'
    });
  }

  if (query.userId && typeof query.userId === 'string') {
    const personalizedScheme = await useDrizzle().query.personalizedNamingSchemes.findFirst({
      where: and(
        eq(tables.personalizedNamingSchemes.memberId, query.userId),
        eq(tables.personalizedNamingSchemes.lobbyId, lobby.id)
      )
    });

    if (personalizedScheme) {
      lobby.namingScheme = personalizedScheme.pattern;
    }
  }

  return lobby;
});