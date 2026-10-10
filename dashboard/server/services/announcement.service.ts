import type { AnnouncementType } from 'shared';

class AnnouncementService {
  async getByGuildId(guildId: string) {
    return useDrizzle().query.announcementsConfigs.findFirst({
      where: eq(tables.announcementsConfigs.guildId, guildId)
    });
  }

  async ensureConfig(guildId: string) {
    const existing = await this.getByGuildId(guildId);
    if (existing) return existing;

    return createDefaultAnnouncementsConfig(guildId);
  }

  async setChannel(guildId: string, channelId: string) {
    await this.ensureConfig(guildId);

    const rows = await useDrizzle()
      .update(tables.announcementsConfigs)
      .set({ channelId })
      .where(eq(tables.announcementsConfigs.guildId, guildId))
      .returning();

    return rows[0] ?? null;
  }

  async setEnabled(guildId: string, type: AnnouncementType, enabled: boolean) {
    await this.ensureConfig(guildId);

    const keyByType = {
      join: 'announceJoin',
      leave: 'announceLeave',
      ban: 'announceBan'
    } as const;

    const rows = await useDrizzle()
      .update(tables.announcementsConfigs)
      .set({ [keyByType[type]]: enabled })
      .where(eq(tables.announcementsConfigs.guildId, guildId))
      .returning();

    return rows[0] ?? null;
  }

  async setMessageEmbed(guildId: string, type: AnnouncementType, message: unknown) {
    await this.ensureConfig(guildId);

    const keyByType = {
      join: 'joinMessageEmbed',
      leave: 'leaveMessageEmbed',
      ban: 'banMessageEmbed'
    } as const;

    const rows = await useDrizzle()
      .update(tables.announcementsConfigs)
      .set({ [keyByType[type]]: message })
      .where(eq(tables.announcementsConfigs.guildId, guildId))
      .returning();

    return rows[0] ?? null;
  }

  getSelection(config: NonNullable<Awaited<ReturnType<AnnouncementService['getByGuildId']>>>, type: AnnouncementType) {
    const map = {
      join: {
        enabled: config.announceJoin,
        messageTemplate: config.joinMessageEmbed
      },
      leave: {
        enabled: config.announceLeave,
        messageTemplate: config.leaveMessageEmbed
      },
      ban: {
        enabled: config.announceBan,
        messageTemplate: config.banMessageEmbed
      }
    } as const;

    const selected = map[type];

    if (!selected.enabled) {
      return null;
    }

    return {
      messageTemplate: selected.messageTemplate,
      channelId: config.channelId
    };
  }
}

const announcementService = new AnnouncementService();

export function useAnnouncementService() {
  return announcementService;
}
