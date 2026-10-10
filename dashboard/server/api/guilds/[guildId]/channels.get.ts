import { useDiscordApiClient } from '~/server/services/discord-api-client.service';
import { defineGuildEventHandler } from '~/server/utils/defineGuildEventHandler';

export default defineGuildEventHandler(async ({ guildId }) => {
  return useDiscordApiClient().getGuildChannels(guildId);
});
