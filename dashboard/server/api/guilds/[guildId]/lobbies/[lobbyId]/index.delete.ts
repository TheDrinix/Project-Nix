export default defineEventHandler(async (event) => {
  const guildId = getRouterParam(event, 'guildId');
  const lobbyId = getRouterParam(event, 'lobbyId');

  if (!guildId || !lobbyId) {
    throw createError({
      message: 'Guild ID and Lobby ID are required',
      status: 400
    });
  }

  const session = await requireUserSession(event);

  if (!session.secure) {
    throw createError({
      message: 'Unauthorized',
      status: 401
    });
  }

  await checkUsersGuildPermissions(session.user.discordId, guildId, session.secure.discord.accessToken);

  const lobby = await useDrizzle().query.lobbies.findFirst({
    where: and(eq(tables.lobbies.id, lobbyId), eq(tables.lobbies.guildId, guildId))
  });

  if (!lobby) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Lobby not found'
    });
  }

  return useDrizzle().delete(tables.lobbies).where(eq(tables.lobbies.id, lobbyId)).execute();
});