import { DiscordChannel } from '~/types/discord';
import { FetchError } from 'ofetch';

export default defineEventHandler(async event => {
  const session = await requireUserSession(event);

  const guildId = getRouterParam(event, 'guildId');
  if (!guildId) {
    throw createError({
      message: 'Guild ID is required',
      status: 400
    });
  }

  const config = useRuntimeConfig();
  const { botToken } = config;

  if (!botToken) {
    throw createError({
      message: 'Bot token is not defined',
      status: 500
    });
  }

  try {
    const channels = await $fetch<DiscordChannel[]>(`https://discord.com/api/guilds/${guildId}/channels`, {
      headers: {
        Authorization: `Bot ${botToken}`
      },
    });

    return channels;
  } catch (e) {
    console.error(e);

    if (e instanceof FetchError && e.status === 404) {
      throw createError({
        message: 'Guild not found',
        status: 404
      });
    }

    throw createError({
      message: 'Failed to load channels',
      status: 500
    });
  }
})