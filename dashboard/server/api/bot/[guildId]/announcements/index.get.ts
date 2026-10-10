import { announcementTypeSchema } from 'shared';
import { useAnnouncementService } from '~/server/services/announcement.service';
import { createApiError } from '~/server/utils/apiError';

export default defineCachedEventHandler(async event => {
  const guildId = getRouterParam(event, 'guildId');
  const query = getQuery(event);
  const selection = announcementTypeSchema.safeParse(query.select);

  if (!guildId) {
    throw createApiError({
      statusCode: 400,
      message: 'Missing guildId'
    });
  }

  if (!selection.success) {
    throw createApiError({
      statusCode: 400,
      message: 'Invalid announcement selection'
    });
  }

  const config = await useAnnouncementService().getByGuildId(guildId);

  if (!config) {
    throw createApiError({
      statusCode: 404,
      message: 'Announcements config not found'
    });
  }

  const result = useAnnouncementService().getSelection(config, selection.data);

  if (!result) {
    throw createApiError({
      statusCode: 404,
      message: 'Announcements config not found'
    });
  }

  return result;
}, {
  maxAge: 6 * 60 * 60,
  name: 'guild-announcements-config',
  getKey: event => {
    const guildId = getRouterParam(event, 'guildId');
    const query = getQuery(event) ?? '';
    return `${guildId}-${query.select}`;
  }
});
