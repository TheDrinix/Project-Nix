import { useAnnouncementService } from '~/server/services/announcement.service';
import { defineGuildEventHandler } from '~/server/utils/defineGuildEventHandler';

export default defineGuildEventHandler(async ({ guildId }) => {
  return useAnnouncementService().ensureConfig(guildId);
});
