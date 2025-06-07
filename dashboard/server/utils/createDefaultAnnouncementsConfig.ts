import { AnnouncementsConfig } from "~/types/announcements";

export const createDefaultAnnouncementsConfig = async (guildId: string) => {
  const defaultConfig: AnnouncementsConfig = {
    guildId,
    channelId: undefined,
    announceJoin: false,
    announceLeave: false,
    announceBan: false,
    joinMessageEmbed: {
      title: 'User Joined',
      description: 'Welcome {user} to the server!',
      fields: [],
      color: 0xc27aff,
    },
    leaveMessageEmbed: {
      title: 'User Left',
      description: 'Goodbye {user} from the server!',
      fields: [],
      color: 0xc27aff,
    },
    banMessageEmbed: {
      title: 'User Banned',
      description: 'User {user} was banned from the server!',
      fields: [],
      color: 0xc27aff,
    },
  }

  return useDrizzle().insert(tables.announcementsConfigs).values(defaultConfig).returning();
}