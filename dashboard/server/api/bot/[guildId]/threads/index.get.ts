import { useThreadService } from '~/server/services/thread.service';

export default defineEventHandler(async event => {
  const guildId = getRouterParam(event, 'guildId');

  if (!guildId) {
    return [];
  }

  return useThreadService().listByGuild(guildId);
});
