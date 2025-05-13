import prisma from "~/lib/prisma";
import { type DiscordGuild } from "~/types/discord";

export default defineEventHandler(async event => {
  const config = useRuntimeConfig();
  const botToken = config.botToken;

  if (!botToken) { 
    throw createError({
      message: 'Bot token is not defined',
      status: 500
    });
  }

  try {
    const query: {
      limit: number,
      after?: string
    } = {
      limit: 200
    }

    while (true) {
      const res = await $fetch<DiscordGuild[]>('https://discord.com/api/users/@me/guilds', {
        headers: {
          Authorization: `Bot ${botToken}`
        },
        query
      });

      query.after = res[res.length - 1]?.id;

      const guilds = await prisma.$transaction(res.map(guild => {
        return prisma.guild.upsert({
          where: {
            id: guild.id
          },
          update: {
            name: guild.name
          },
          create: {
            id: guild.id,
            name: guild.name
          }
        });
      }));

      if (res.length < 200) break;
    }
  } catch (e: any) {
    console.error(e);

    throw createError({
      name: 'Failed to load guilds',
      message: e.message,
      status: 500
    });
  }
}); 