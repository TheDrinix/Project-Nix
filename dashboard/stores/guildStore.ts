import type { Guild, GuildStoreState } from '~/types/guild';

export const useGuildStore = defineStore('guilds', {
  state: (): GuildStoreState => ({
    guilds: new Map<string, Guild>(),
  }),
  getters: {
    getGuilds: (state) => Array.from(state.guilds.values()),
    getGuild: (state) => {
      return (guildId: string) => state.guilds.get(guildId);
    }
  },
  actions: {
    async fetchGuilds() {
      try {
        const guilds = await useRequestFetch()('/api/guilds')

        this.guilds.clear();

        for (const guild of guilds) {
          this.guilds.set(guild.id, guild);
        }

        return guilds;
      } catch (error) {
        console.error('Failed to fetch guilds:', error);

        throw error;
      }
    }
  }
})