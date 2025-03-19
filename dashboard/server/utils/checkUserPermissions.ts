export const checkUsersGuildPermissions = async (userId: string, guildId: string, accessToken: string) => {
  const guilds = await getUserGuilds(userId, accessToken);

  const hasPermissions = guilds.some(guild => guild.id === guildId);

  if (!hasPermissions) {
    throw createError({
      message: 'You do not have permission to access this guild',
      status: 403,
    });
  }
}