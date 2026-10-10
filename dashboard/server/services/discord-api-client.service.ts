import { FetchError } from 'ofetch';
import type { DiscordChannel, DiscordGuild } from '~/types/discord';
import { createApiError } from '~/server/utils/apiError';

type DiscordRequestOptions = {
  token: string;
  tokenType: 'Bot' | 'Bearer';
  query?: Record<string, string | number | undefined>;
};

class DiscordApiClient {
  private readonly baseUrl = 'https://discord.com/api';

  async getGuildChannels(guildId: string): Promise<DiscordChannel[]> {
    const botToken = useRuntimeConfig().botToken;

    if (!botToken) {
      throw createApiError({
        statusCode: 500,
        message: 'Bot token is not defined'
      });
    }

    return this.request<DiscordChannel[]>(`/guilds/${guildId}/channels`, {
      token: botToken,
      tokenType: 'Bot'
    });
  }

  async getBotGuildsPage(after?: string, limit = 200): Promise<DiscordGuild[]> {
    const botToken = useRuntimeConfig().botToken;

    if (!botToken) {
      throw createApiError({
        statusCode: 500,
        message: 'Bot token is not defined'
      });
    }

    return this.request<DiscordGuild[]>('/users/@me/guilds', {
      token: botToken,
      tokenType: 'Bot',
      query: { after, limit }
    });
  }

  async getUserGuilds(accessToken: string): Promise<DiscordGuild[]> {
    return this.request<DiscordGuild[]>('/users/@me/guilds', {
      token: accessToken,
      tokenType: 'Bearer'
    });
  }

  private async request<T>(path: string, options: DiscordRequestOptions): Promise<T> {
    const headers = {
      Authorization: `${options.tokenType} ${options.token}`
    };

    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        return await $fetch<T>(`${this.baseUrl}${path}`, {
          headers,
          query: options.query
        });
      } catch (error) {
        if (error instanceof FetchError && error.status === 429) {
          const retryAfterHeader = error.response?.headers.get('retry-after');
          const retryAfterSeconds = Number(retryAfterHeader ?? '1');
          await new Promise(resolve => setTimeout(resolve, Number.isFinite(retryAfterSeconds) ? retryAfterSeconds * 1000 : 1000));
          continue;
        }

        throw this.toApiError(error);
      }
    }

    throw createApiError({
      statusCode: 429,
      message: 'Discord API rate limit reached',
      code: 'RATE_LIMITED'
    });
  }

  private toApiError(error: unknown) {
    if (error instanceof FetchError) {
      if (error.status === 404) {
        return createApiError({
          statusCode: 404,
          message: 'Resource not found on Discord',
          code: 'NOT_FOUND'
        });
      }

      return createApiError({
        statusCode: error.statusCode ?? 502,
        message: 'Discord API request failed',
        code: 'UPSTREAM_ERROR',
        details: error.data
      });
    }

    return createApiError({
      statusCode: 500,
      message: 'Unexpected Discord API error',
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
}

const discordApiClient = new DiscordApiClient();

const getUserGuildsCached = defineCachedFunction(async (userId: string, accessToken: string) => {
  const guilds = await discordApiClient.getUserGuilds(accessToken);
  return guilds.filter(guild => guild.owner || ((guild.permissions & 8) === 8));
}, {
  maxAge: 15 * 60,
  name: 'userGuilds',
  getKey: (userId: string) => userId
});

export function useDiscordApiClient() {
  return discordApiClient;
}

export function getCachedUserGuilds(userId: string, accessToken: string) {
  return getUserGuildsCached(userId, accessToken);
}
