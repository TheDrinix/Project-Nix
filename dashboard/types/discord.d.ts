export interface DiscordGuild {
  id: string;
  name: string;
  icon?: string;
  banner?: string;
  owner: boolean;
  permissions: number;
  permissions_new: string;
  features: string[];
}

export interface DiscordChannel {
  id: string;
  type: DiscordChannelType;
  guild_id: string;
  position: number;
  name: string;
  parent_id: string;
}

export enum DiscordChannelType {
  GUILD_TEXT,
  DM,
  GUILD_VOICE,
  GROUP_DM,
  GUILD_CATEGORY,
  GUILD_ANNOUNCEMENT,
  ANNOUNCEMENT_THREAD = 10,
  PUBLIC_THREAD,
  PRIVATE_THREAD,
  GUILD_STAGE_VOICE,
  GUILD_DIRECTORY,
  GUILD_FORUM,
  GUILD_MEDIA
}