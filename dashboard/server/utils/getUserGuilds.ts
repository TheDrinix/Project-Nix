import { getCachedUserGuilds } from '~/server/services/discord-api-client.service';

export const getUserGuilds = (userId: string, accessToken: string) => {
  return getCachedUserGuilds(userId, accessToken);
};
