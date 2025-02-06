import prisma from "~/lib/prisma";
import { z } from "zod";

const querySchema = z.object({
  userId: z.string().optional()
})

export default defineEventHandler(async event => {
  const guildId = getRouterParam(event, 'guildId');
  const entrypointId = getRouterParam(event, 'lobbyId');
  const query = await getValidatedQuery(event, q => querySchema.parse(q));

  const lobby = await prisma.lobby.findFirst({
    where: {
      guildId: guildId,
      entryPointId: entrypointId
    }
  });

  if (!lobby) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Lobby not Found'
    });
  }

  let namingScheme = lobby.namingScheme;

  if (lobby.allowPersonalizedNaming && query.userId) {
    const personalizedScheme = await prisma.personalizedNamingScheme.findFirst({
      where: {
        memberId: query.userId,
        lobbyId: lobby.id
      }
    });

    if (personalizedScheme) namingScheme = personalizedScheme.pattern;
  }

  return namingScheme;
});