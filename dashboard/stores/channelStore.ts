import type { ChannelStoreState } from '~/types/guild';
import type { DiscordChannel } from '~/types/discord';

export const useChannelStore = defineStore('channels', {
  state: (): ChannelStoreState => ({
    guildsChannels: new Map<string, Map<string, DiscordChannel>>(),
  }),
  getters: {
    getChannelName: (state) => {
      return (guildId: string, channelId: string) => {
        if (!channelId.length) return 'Some unknown channel';

        const channels = state.guildsChannels.get(guildId);
        if (!channels) return 'Some unknown channel';

        const channel = channels.get(channelId);
        return channel?.name || 'Some unknown channel';
      }
    }
  },
  actions: {
    async fetchChannels(guildId: string) {
      const guilds = await useRequestFetch()(`/api/guilds/${guildId}/channels`);

      const channels: Map<string, DiscordChannel> = this.guildsChannels.get(guildId) || new Map<string, DiscordChannel>();
      channels.clear();

      for (const channel of guilds) {
        channels.set(channel.id, channel);
      }

      this.guildsChannels.set(guildId, channels);

      return channels;
    }
  }
})