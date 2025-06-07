export default defineEventHandler(async event => {
  const guildId = getRouterParam(event, 'id');

  if (!guildId) return;

  await useDrizzle().delete(tables.announcementsConfigs)
    .where(eq(tables.announcementsConfigs.guildId, guildId))
    .execute();
});