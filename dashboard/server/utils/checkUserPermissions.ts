import { createApiError } from '~/server/utils/apiError';

export const checkUsersGuildPermissions = async (userId: string, guildId: string, accessToken: string) => {
  const guilds = await getUserGuilds(userId, accessToken);

  const hasPermissions = guilds.some(guild => guild.id === guildId);

  if (!hasPermissions) {
    throw createApiError({
      statusCode: 403,
      message: 'You do not have permission to access this guild',
      code: 'FORBIDDEN'
    });
  }
};
