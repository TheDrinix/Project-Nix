export default defineEventHandler(async event => {
  const guildId = getRouterParam(event, 'guildId');

  if (!guildId) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Guild not Found'
    });
  }

  const guild = await useDrizzle().query.guilds.findFirst({
    where: eq(tables.guilds.id, guildId)
  });

  if (!guild) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Guild not Found'
    });
  }

  return {
    roleId: guild.PNRole
  };
});