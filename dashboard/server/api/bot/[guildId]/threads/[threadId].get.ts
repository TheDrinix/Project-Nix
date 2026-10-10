import { useThreadService } from '~/server/services/thread.service';
import { createApiError } from '~/server/utils/apiError';

export default defineEventHandler(async event => {
  const guildId = getRouterParam(event, 'guildId');
  const threadId = getRouterParam(event, 'threadId');

  if (!guildId || !threadId) {
    throw createApiError({
      statusCode: 404,
      message: 'Thread not found'
    });
  }

  const thread = await useThreadService().findByGuildAndThreadId(guildId, threadId);

  if (!thread) {
    throw createApiError({
      statusCode: 404,
      message: 'Thread not found'
    });
  }

  return thread;
});
