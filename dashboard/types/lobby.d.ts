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

export interface LobbyStoreState {
  lobbies: Map<string, Lobby>;
}