import type { Lobby, LobbyStoreState } from '~/types/lobby';

export const useLobbyStore = defineStore('lobbies', {
  state: (): LobbyStoreState => ({
    lobbies: new Map<string, Lobby>(),
    guildsLoadedAt: new Map<string, Date>(),
  }),
  getters: {
    getLobby: (state) => {
      return (lobbyId: string) => {
        return state.lobbies.get(lobbyId);
      }
    },
    getGuildLobbies: state => {
      return (guildId: string) => {
        return Array.from(state.lobbies.values())
          .filter(lobby => lobby.guildId === guildId);
      }
    }
  },
  actions: {
    async fetchLobbies(guildId: string, force = false) {
      const hasBeenLoadedAt = this.guildsLoadedAt.get(guildId);
      if (hasBeenLoadedAt && !force) {
        const now = new Date();
        const diff = now.getTime() - hasBeenLoadedAt.getTime();
        if (diff < 1000 * 60 * 5) {
          return this.getGuildLobbies(guildId);
        }
      }

      const res = await useRequestFetch()<Lobby[]>(`/api/guilds/${guildId}/lobbies`);

      const lobbies = this.lobbies;
      for (const lobby of res) {
        lobbies.set(lobby.id, lobby);
      }

      this.lobbies = lobbies;
      this.guildsLoadedAt.set(guildId, new Date());

      return res;
    },
    disableLobby(lobbyId: string) {
      this.lobbies.delete(lobbyId);
    }
  }
})