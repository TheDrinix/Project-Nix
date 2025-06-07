import prisma from "~/lib/prisma"

export default defineCachedEventHandler(async (event) => {
  const guildCount = await prisma.guild.count()
  const lobbyCount = await prisma.lobby.count()
  const watchedThreadsCount = await prisma.watchedThread.count()

  return {
    guildCount,
    activeLobbies: lobbyCount,
    watchedThreads: watchedThreadsCount
  }
}, {
  maxAge: 30 * 60, // Cache for 30 minutes
  swr: true // Enable stale-while-revalidate
})
