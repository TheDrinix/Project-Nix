import { useGuildService } from '~/server/services/guild.service';

export default defineEventHandler(() => {
  return useGuildService().list();
});
