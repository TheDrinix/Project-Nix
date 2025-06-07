export default defineEventHandler(async event => {
  const guildId = getRouterParam(event, 'guildId');

  if (!guildId) {
    return [];
  }

  return useDrizzle().query.lobbies.findMany({
    where: eq(tables.lobbies.guildId, guildId)
  });
});