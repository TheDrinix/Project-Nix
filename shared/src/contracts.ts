import { z } from 'zod';
import {
  announcementTypeSchema,
  botCreateLobbySchema,
  threadWatchSchema
} from './schemas';

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

export type CreateLobbyData = z.infer<typeof botCreateLobbySchema>;

export interface ProtectChannelResponse {
  lobby: Lobby;
  isProtected: boolean;
  channelId: string;
}

export interface WatchedThread {
  id: string;
  guildId: string;
  parentId: string;
}

export interface WatchThreadResponse {
  watchedThread: WatchedThread;
  isWatched: boolean;
}

export type WatchThreadPayload = z.infer<typeof threadWatchSchema>;
export type AnnouncementType = z.infer<typeof announcementTypeSchema>;
