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