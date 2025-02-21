import type { DiscordChannel } from '~/types/discord';

export interface Guild {
  id: string;
  name: string;
  icon?: string;
}

export interface GuildStoreState {
  guilds: Map<string, Guild>;
  hasBeenLoaded: boolean;
}

export interface ChannelStoreState {
  channels: Map<string, DiscordChannel>;
}