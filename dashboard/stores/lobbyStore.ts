import type { Lobby, LobbyStoreState } from '~/types/lobby';

export const useLobbyStore = defineStore('lobbies', {
  state: (): LobbyStoreState => ({
    lobbies: new Map<string, Lobby>(),
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
    async fetchLobbies(guildId: string) {
      const res = await useRequestFetch()<Lobby[]>(`/api/guilds/${guildId}/lobbies`);

      const lobbies = this.lobbies;
      for (const lobby of res) {
        lobbies.set(lobby.id, lobby);
      }

      this.lobbies = lobbies;

      return res;
    },
    disableLobby(lobbyId: string) {
      this.lobbies.delete(lobbyId);
    }
  }
})