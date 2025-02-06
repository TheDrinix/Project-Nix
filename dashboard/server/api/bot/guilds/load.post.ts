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
    const res = await $fetch<DiscordGuild[]>('https://discord.com/api/users/@me/guilds', {
      headers: {
        Authorization: `Bot ${botToken}`
      }
    });

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

    return guilds;
  } catch (e) {
    throw createError({
      message: 'Failed to load guilds',
      status: 500
    });
  }
}); 