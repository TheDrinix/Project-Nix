export { sql, eq, and, or } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/node-postgres'

import * as schema from '../database/schema'

export const tables = schema;

export function useDrizzle() {
  return drizzle(process.env.DATABASE_URL!, { schema })
}

export type Guild = typeof schema.guilds.$inferSelect;
export type Lobby = typeof schema.lobbies.$inferSelect;
export type PersonalizedNamingScheme = typeof schema.personalizedNamingSchemes.$inferSelect;
export type WatchedThread = typeof schema.watchedThreads.$inferSelect;
export type AnnouncementsConfig = typeof schema.announcementsConfigs.$inferSelect;