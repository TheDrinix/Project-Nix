import { announcementToggleSchema } from 'shared';
import { useAnnouncementService } from '~/server/services/announcement.service';
import { createValidationError } from '~/server/utils/apiError';
import { defineGuildEventHandler } from '~/server/utils/defineGuildEventHandler';

export default defineGuildEventHandler(async ({ event, guildId }) => {
  const body = await readValidatedBody(event, b => announcementToggleSchema.safeParse(b));

  if (!body.success) {
    throw createValidationError(body.error.flatten());
  }

  return useAnnouncementService().setEnabled(guildId, body.data.type, body.data.enabled);
});
