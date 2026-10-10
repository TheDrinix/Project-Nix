import { useGuildService } from '~/server/services/guild.service';

export default defineEventHandler(async event => {
  const guildId = getRouterParam(event, 'id');

  if (!guildId) return;

  await useGuildService().removeAnnouncementsConfig(guildId);
});
