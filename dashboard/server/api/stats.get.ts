import { count } from "drizzle-orm"

export default defineCachedEventHandler(async (event) => {
  const guildCount = await useDrizzle().select({ count: count() }).from(tables.guilds)
  const lobbyCount = await useDrizzle().select({ count: count() }).from(tables.lobbies)
  const watchedThreadsCount = await useDrizzle().select({ count: count() }).from(tables.watchedThreads)

  return {
    guildCount: guildCount[0].count,
    activeLobbies: lobbyCount[0].count,
    watchedThreads: watchedThreadsCount[0].count
  }
}, {
  maxAge: 30 * 60, // Cache for 30 minutes
  swr: true // Enable stale-while-revalidate
})
