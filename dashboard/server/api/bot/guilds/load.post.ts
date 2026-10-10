import { useDiscordApiClient } from '~/server/services/discord-api-client.service';
import { useGuildService } from '~/server/services/guild.service';

export default defineEventHandler(async () => {
  const discordApiClient = useDiscordApiClient();
  const guildService = useGuildService();

  let after: string | undefined;

  while (true) {
    const guilds = await discordApiClient.getBotGuildsPage(after, 200);

    if (guilds.length === 0) {
      break;
    }

    await guildService.upsertMany(guilds);

    after = guilds[guilds.length - 1]?.id;

    if (guilds.length < 200) {
      break;
    }
  }

  return { ok: true };
});
