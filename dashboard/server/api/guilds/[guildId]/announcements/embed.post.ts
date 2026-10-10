import { z } from 'zod';
import { announcementTypeSchema } from 'shared';
import { embedSchema } from '~/utils/embed';
import { useAnnouncementService } from '~/server/services/announcement.service';
import { createValidationError } from '~/server/utils/apiError';
import { defineGuildEventHandler } from '~/server/utils/defineGuildEventHandler';

const embedUpdateSchema = z.object({
  type: announcementTypeSchema,
  message: embedSchema
});

export default defineGuildEventHandler(async ({ event, guildId }) => {
  const body = await readValidatedBody(event, b => embedUpdateSchema.safeParse(b));

  if (!body.success) {
    throw createValidationError(body.error.flatten());
  }

  return useAnnouncementService().setMessageEmbed(guildId, body.data.type, body.data.message);
});
