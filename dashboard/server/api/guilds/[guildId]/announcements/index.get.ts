export default defineEventHandler(async (event) => {
  const guildId = getRouterParam(event, 'guildId');

  if (!guildId) {
    throw createError({
      message: 'Guild ID is required',
      status: 400
    });
  }

  const session = await requireUserSession(event);

  if (!session.secure) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    });
  }

  await checkUsersGuildPermissions(session.user.discordId, guildId, session.secure.discord.accessToken);

  const config = await useDrizzle().query.announcementsConfigs.findFirst({
    where: eq(tables.announcementsConfigs.guildId, guildId),
  });

  if (!config) {
    return createDefaultAnnouncementsConfig(guildId);
  }

  return config;
})