import type { Embed } from '~/types/embed';

export interface AnnouncementsConfig {
  guildId: string;
  channelId: string | undefined | null;
  announceJoin: boolean;
  announceLeave: boolean;
  announceBan: boolean;
  joinMessageEmbed: Embed;
  leaveMessageEmbed: Embed;
  banMessageEmbed: Embed;
}