import prisma from "~/lib/prisma";

export default defineEventHandler(async event => {
  const guildId = getRouterParam(event, 'id');

  await prisma.guild.delete({
    where: {
      id: guildId
    }
  });
});