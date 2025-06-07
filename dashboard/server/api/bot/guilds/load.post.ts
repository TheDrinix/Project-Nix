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

      await useDrizzle().transaction(async (tx) => {
        for (const guild of res) {
          await tx.insert(tables.guilds).values({
            id: guild.id,
            name: guild.name
          }).onConflictDoUpdate({
            target: [tables.guilds.id],
            set: {
              name: guild.name
            }
          });
        }
      });

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