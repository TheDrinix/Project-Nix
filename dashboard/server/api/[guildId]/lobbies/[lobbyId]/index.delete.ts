import prisma from "~/lib/prisma";

export default defineEventHandler(async event => {
  const guildId = getRouterParam(event, 'guildId');
  const lobbyId = getRouterParam(event, 'lobbyId');

  await prisma.lobby.delete({
    where: {
      guildId: guildId,
      entryPointId: lobbyId
    }
  });
});