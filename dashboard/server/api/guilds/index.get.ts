import prisma from '~/lib/prisma';
import { DiscordGuild } from '~/types/discord';

export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);

  if (!session.secure) {
    throw createError({
      message: 'Unauthorized',
      status: 401
    });
  }

  try {
    const res = await $fetch<DiscordGuild[]>('https://discord.com/api/users/@me/guilds', {
      headers: {
        Authorization: `Bearer ${session.secure.discord.accessToken}`
      }
    })

    const botGuilds = await prisma.guild.findMany();
    const botGuildIds: Set<string> = new Set(botGuilds.map(guild => guild.id));

    return res
      .filter(guild => guild.owner || ((guild.permissions & 8) === 8))
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
