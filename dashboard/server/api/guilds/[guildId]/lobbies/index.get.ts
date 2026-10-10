import { useLobbyService } from '~/server/services/lobby.service';
import { defineGuildEventHandler } from '~/server/utils/defineGuildEventHandler';

export default defineGuildEventHandler(async ({ guildId }) => {
  return useLobbyService().listByGuild(guildId);
});
