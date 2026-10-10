import { z } from 'zod';

export const announcementTypeSchema = z.enum(['join', 'leave', 'ban']);

export const botCreateLobbySchema = z.object({
  lobbyId: z.string().nonempty(),
  entrypointId: z.string().nonempty(),
  guildId: z.string().nonempty(),
  waitingRoomId: z.string().optional(),
  allowPersonalizedNaming: z.boolean().default(false),
  namingScheme: z.string().min(3).max(50),
  protectedChannelIds: z.array(z.string().nonempty())
});

export const dashboardCreateLobbySchema = z.object({
  entryPointId: z.string().nonempty(),
  namingScheme: z.string().min(3).max(50),
  allowPersonalizedNaming: z.boolean(),
  protectedChannelIds: z.array(z.string().nonempty()),
  waitingRoomId: z.string().nullable()
});

export const dashboardUpdateLobbySchema = z.object({
  namingScheme: z.string().min(3).max(50),
  entryPointId: z.string().nonempty(),
  waitingRoomId: z.string().nullable(),
  allowPersonalizedNaming: z.boolean()
});

export const threadWatchSchema = z.object({
  channelId: z.string().nonempty(),
  parentId: z.string().nonempty()
});

export const announcementChannelSchema = z.object({
  channelId: z.string().min(1, 'Channel ID is required')
});

export const announcementToggleSchema = z.object({
  type: announcementTypeSchema,
  enabled: z.boolean()
});

export const guildUpsertSchema = z.object({
  guildId: z.string().nonempty(),
  name: z.string().nonempty()
});
