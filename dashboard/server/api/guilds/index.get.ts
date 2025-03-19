import prisma from '~/lib/prisma';

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);

  if (!session.secure) {
    throw createError({
      message: 'Unauthorized',
      status: 401
    });
  }

  try {
    const userGuilds = await getUserGuilds(session.user.discordId, session.secure.discord.accessToken);
    const userGuildsIds = userGuilds.map(guild => guild.id);

    const botGuilds = await prisma.guild.findMany({
      where: {
        id: {
          in: userGuildsIds
        },
      },
      select: {
        id: true
      }
    });
    const botGuildIds: Set<string> = new Set(botGuilds.map(guild => guild.id));

    return userGuilds
      .filter(guild => botGuildIds.has(guild.id))
      .map(guild => ({
        id: guild.id,
        name: guild.name,
        icon: guild.icon
      }));
  } catch (e) {
    console.error(e);

    throw createError({
      message: 'Failed to load guilds',
      status: 500
    });
  }
});
