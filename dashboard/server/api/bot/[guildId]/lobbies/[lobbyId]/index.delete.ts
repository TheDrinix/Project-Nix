export default defineEventHandler(async event => {
  const guildId = getRouterParam(event, 'guildId');
  const lobbyId = getRouterParam(event, 'lobbyId');

  if (!guildId || !lobbyId) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Lobby not found'
    });
  }

  const lobby = await useDrizzle().query.lobbies.findFirst({
    where: and(
      eq(tables.lobbies.guildId, guildId),
      eq(tables.lobbies.entryPointId, lobbyId)
    )
  });

  if (!lobby) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Lobby not found'
    });
  }

  await useDrizzle().delete(tables.lobbies)
    .where(
      and(
        eq(tables.lobbies.guildId, guildId),
        eq(tables.lobbies.entryPointId, lobbyId)
      )
    );
});