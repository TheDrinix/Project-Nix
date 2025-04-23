import type { ChannelStoreState } from '~/types/guild';
import type { DiscordChannel } from '~/types/discord';

export const useChannelStore = defineStore('channels', {
  state: (): ChannelStoreState => ({
    channels: new Map<string, DiscordChannel>(),
  }),
  getters: {
    getChannelName: (state) => {
      return (channelId: string) => {
        const channel = state.channels.get(channelId);

        return channel?.name || 'Some unknown channel';
      }
    },
    getGuildVoiceChannels: state => {
      return (guildId: string): DiscordChannel[] => {
        return Array.from(state.channels.values())
          .filter(channel => channel.type === 2 && channel.guild_id === guildId);
        }
    },
    getLobbyChannels: state => {
      return (lobbyId: string): DiscordChannel[] => {
        return Array.from(state.channels.values())
          .filter(channel => channel.type === 2 && channel.parent_id === lobbyId);
      }
    },
    getGuildChannelCategories: state => {
      return (guildId: string): DiscordChannel[] => {
        return Array.from(state.channels.values())
          .filter(channel => channel.type === 4 && channel.guild_id === guildId);
      }
    }
  },
  actions: {
    async fetchChannels(guildId: string) {
      const res = await useRequestFetch()(`/api/guilds/${guildId}/channels`);

      const channels: Map<string, DiscordChannel> = this.channels || new Map<string, DiscordChannel>();

      for (const channel of res) {
        channels.set(channel.id, channel);
      }

      this.channels = channels;

      return res;
    }
  }
})