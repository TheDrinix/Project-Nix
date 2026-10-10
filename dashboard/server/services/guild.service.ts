import { inArray } from 'drizzle-orm';
import type { DiscordGuild } from '~/types/discord';

class GuildService {
  async list() {
    return useDrizzle().query.guilds.findMany();
  }

  async getById(guildId: string) {
    return useDrizzle().query.guilds.findFirst({
      where: eq(tables.guilds.id, guildId)
    });
  }

  async upsert(guildId: string, name: string) {
    return useDrizzle()
      .insert(tables.guilds)
      .values({ id: guildId, name })
      .onConflictDoUpdate({
        target: [tables.guilds.id],
        set: { name }
      })
      .returning()
      .then(rows => rows[0] ?? null);
  }

  async upsertMany(guilds: DiscordGuild[]) {
    await useDrizzle().transaction(async tx => {
      for (const guild of guilds) {
        await tx
          .insert(tables.guilds)
          .values({ id: guild.id, name: guild.name })
          .onConflictDoUpdate({
            target: [tables.guilds.id],
            set: { name: guild.name }
          });
      }
    });
  }

  async removeAnnouncementsConfig(guildId: string) {
    await useDrizzle()
      .delete(tables.announcementsConfigs)
      .where(eq(tables.announcementsConfigs.guildId, guildId))
      .execute();
  }

  async getBotGuildIdsForUserGuildIds(userGuildIds: string[]) {
    if (userGuildIds.length === 0) {
      return new Set<string>();
    }

    const rows = await useDrizzle()
      .select({ id: tables.guilds.id })
      .from(tables.guilds)
      .where(inArray(tables.guilds.id, userGuildIds));

    return new Set(rows.map(row => row.id));
  }
}

const guildService = new GuildService();

export function useGuildService() {
  return guildService;
}
