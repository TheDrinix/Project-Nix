import prisma from '~/lib/prisma';

export default defineEventHandler(async event => {
  const guildId = getRouterParam(event, 'guildId');

  return prisma.watchedThread.findMany({
    where: {
      guildId,
    }
  });
});