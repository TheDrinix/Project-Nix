import { guildUpsertSchema } from 'shared';
import { useGuildService } from '~/server/services/guild.service';
import { createValidationError } from '~/server/utils/apiError';

export default defineEventHandler(async event => {
  const res = await readValidatedBody(event, body => guildUpsertSchema.safeParse(body));

  if (!res.success) {
    throw createValidationError(res.error.errors.map(err => err.message).join('\n'));
  }

  return useGuildService().upsert(res.data.guildId, res.data.name);
});
