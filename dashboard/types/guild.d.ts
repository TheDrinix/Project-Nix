import type { DiscordChannel } from '~/types/discord';

export interface Guild {
  id: string;
  name: string;
  icon?: string;
}

export interface GuildStoreState {
  guilds: Map<string, Guild>;
}

export interface ChannelStoreState {
  guildsChannels: Map<string, Map<string, DiscordChannel>>;
}

export interface Lobby {
  guildId: string;
  id: string;
  entryPointId: string;
  isPrivate: boolean;
  waitingRoomId: string | null;
  namingScheme: string;
  allowPersonalizedNaming: boolean;
  protectedChannelIds: string[]
}