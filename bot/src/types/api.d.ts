export interface Lobby {
  id: string;
  entryPointId: string;
  isPrivate: boolean;
  waitingRoomId: string | null;
  namingScheme: string;
  allowPersonalizedNaming: boolean;
  protectedChannelIds: string[];
  guildId: string;
}

export interface CreateLobbyData {
  lobbyId: string;
  entrypointId: string;
  guildId: string;
  namingScheme: string;
  allowPersonalizedNaming: boolean;
  waitingRoomId?: string;
  protectedChannelIds: string[];
}

export interface ProtectChannelResponse {
  lobby: Lobby;
  isProtected: boolean;
  channelId: string;
}