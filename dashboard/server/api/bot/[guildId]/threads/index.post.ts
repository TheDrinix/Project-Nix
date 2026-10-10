import { threadWatchSchema } from 'shared';
import { useThreadService } from '~/server/services/thread.service';
import { createApiError, createValidationError } from '~/server/utils/apiError';

export default defineEventHandler(async event => {
  const guildId = getRouterParam(event, 'guildId');

  if (!guildId) {
    throw createApiError({
      statusCode: 400,
      message: 'Invalid guild ID'
    });
  }

  const res = await readValidatedBody(event, body => threadWatchSchema.safeParse(body));

  if (!res.success) {
    throw createValidationError(res.error.errors.map(err => err.message).join('\n'));
  }

  return useThreadService().toggleWatch(guildId, res.data.channelId, res.data.parentId);
});
