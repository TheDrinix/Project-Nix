import { DiscordGuild } from '~/types/discord';

export const getUserGuilds = defineCachedFunction(async (userId: string, accessToken: string) => {
  const guilds = await $fetch<DiscordGuild[]>('https://discord.com/api/users/@me/guilds', {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  console.log("Loading guilds for: " + userId);

  return guilds.filter(guild => guild.owner || ((guild.permissions & 8) === 8));
}, {
  maxAge: 15 * 60, // 15 minutes
  name: 'userGuilds',
  getKey: (userId: string, accessToken: string) => userId
});