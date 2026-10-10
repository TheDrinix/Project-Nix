import type { H3Event } from 'h3';
import { createApiError } from '~/server/utils/apiError';

interface GuildEventContext {
  event: H3Event;
  guildId: string;
  session: Awaited<ReturnType<typeof requireUserSession>>;
}

export function defineGuildEventHandler(handler: (ctx: GuildEventContext) => Promise<unknown> | unknown) {
  return defineEventHandler(async event => {
    const guildId = getRouterParam(event, 'guildId');

    if (!guildId) {
      throw createApiError({
        statusCode: 400,
        message: 'Guild ID is required',
        code: 'BAD_REQUEST'
      });
    }

    const session = await requireUserSession(event);

    if (!session.secure) {
      throw createApiError({
        statusCode: 401,
        message: 'Unauthorized',
        code: 'UNAUTHORIZED'
      });
    }

    await checkUsersGuildPermissions(session.user.discordId, guildId, session.secure.discord.accessToken);

    return handler({ event, guildId, session });
  });
}
