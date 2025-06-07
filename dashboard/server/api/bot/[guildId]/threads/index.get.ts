export default defineEventHandler(async event => {
  const guildId = getRouterParam(event, 'guildId');

  if (!guildId) {
    return []
  }

  return useDrizzle().query.watchedThreads.findMany({
    where: eq(tables.watchedThreads.guildId, guildId)
  });
});