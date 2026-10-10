import { createApiError } from '~/server/utils/apiError';
import { useGuildService } from '~/server/services/guild.service';

export default defineEventHandler(async event => {
  const session = await requireUserSession(event);

  if (!session.secure) {
    throw createApiError({
      statusCode: 401,
      message: 'Unauthorized'
    });
  }

  const userGuilds = await getUserGuilds(session.user.discordId, session.secure.discord.accessToken);
  const userGuildIds = userGuilds.map(guild => guild.id);
  const botGuildIds = await useGuildService().getBotGuildIdsForUserGuildIds(userGuildIds);

  return userGuilds
    .filter(guild => botGuildIds.has(guild.id))
    .map(guild => ({
      id: guild.id,
      name: guild.name,
      icon: guild.icon
    }));
});
