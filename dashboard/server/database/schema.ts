import { pgTable, text, boolean, jsonb, unique, primaryKey, index, varchar } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Guild table
export const guilds = pgTable('Guild', {
  id: text('id').notNull().primaryKey(),
  name: text('name').notNull(),
  PNRole: text('PNRole'),
});

// Lobby table
export const lobbies = pgTable('Lobby', {
  id: text('id').notNull().primaryKey(),
  entryPointId: text('entryPointId').notNull().unique(),
  isPrivate: boolean('isPrivate').notNull().default(false),
  waitingRoomId: text('waitingRoomId').unique(),
  namingScheme: text('namingScheme').notNull(),
  allowPersonalizedNaming: boolean('allowPersonalizedNaming').notNull().default(false),
  protectedChannelIds: text('protectedChannelIds').array().notNull().default([]), // Representing String[] as text array
  guildId: text('guildId').notNull(),
});

// PersonalizedNamingScheme table
export const personalizedNamingSchemes = pgTable('PersonalizedNamingScheme', {
  pattern: text('pattern').notNull(),
  memberId: text('memberId').notNull(),
  lobbyId: text('lobbyId').notNull(),
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.lobbyId, table.memberId] }),
  };
});

// WatchedThread table
export const watchedThreads = pgTable('WatchedThread', {
  id: text('id').notNull().primaryKey(),
  parentId: text('parentId').notNull(),
  guildId: text('guildId').notNull(),
});

// AnnouncementsConfig table
export const announcementsConfigs = pgTable('AnnouncementsConfig', {
  guildId: text('guildId').notNull().primaryKey(), // @id @unique in Prisma implies primary key
  channelId: text('channelId'),
  announceJoin: boolean('announceJoin').notNull().default(false),
  joinMessageEmbed: jsonb('joinMessageEmbed').notNull().default({}),
  announceLeave: boolean('announceLeave').notNull().default(false),
  leaveMessageEmbed: jsonb('leaveMessageEmbed').notNull().default({}),
  announceBan: boolean('announceBan').notNull().default(false),
  banMessageEmbed: jsonb('banMessageEmbed').notNull().default({}),
});

// Relations
export const guildRelations = relations(guilds, ({ many, one }) => ({
  lobbies: many(lobbies),
  watchedThreads: many(watchedThreads),
  announcements: one(announcementsConfigs, {
    fields: [guilds.id],
    references: [announcementsConfigs.guildId],
  }),
}));

export const lobbyRelations = relations(lobbies, ({ one, many }) => ({
  guild: one(guilds, {
    fields: [lobbies.guildId],
    references: [guilds.id],
  }),
  personalizedNamingSchemes: many(personalizedNamingSchemes),
}));

export const personalizedNamingSchemeRelations = relations(personalizedNamingSchemes, ({ one }) => ({
  lobby: one(lobbies, {
    fields: [personalizedNamingSchemes.lobbyId],
    references: [lobbies.id],
  }),
}));

export const watchedThreadRelations = relations(watchedThreads, ({ one }) => ({
  guild: one(guilds, {
    fields: [watchedThreads.guildId],
    references: [guilds.id],
  }),
}));

export const announcementsConfigRelations = relations(announcementsConfigs, ({ one }) => ({
  guild: one(guilds, {
    fields: [announcementsConfigs.guildId],
    references: [guilds.id],
  }),
}));