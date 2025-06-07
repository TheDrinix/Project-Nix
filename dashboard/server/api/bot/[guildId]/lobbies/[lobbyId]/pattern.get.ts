import { z } from "zod";

const querySchema = z.object({
  userId: z.string().optional()
})

export default defineEventHandler(async event => {
  const guildId = getRouterParam(event, 'guildId');
  const entrypointId = getRouterParam(event, 'lobbyId');
  const query = await getValidatedQuery(event, q => querySchema.parse(q));

  if (!guildId || !entrypointId) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Lobby not Found'
    });
  }

  const lobby = await useDrizzle().query.lobbies.findFirst({
    where: and(
      eq(tables.lobbies.guildId, guildId),
      eq(tables.lobbies.entryPointId, entrypointId)
    )
  });

  if (!lobby) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Lobby not Found'
    });
  }

  let namingScheme = lobby.namingScheme;

  if (lobby.allowPersonalizedNaming && query.userId) {
    const personalizedScheme = await useDrizzle().query.personalizedNamingSchemes.findFirst({
      where: and(
        eq(tables.personalizedNamingSchemes.memberId, query.userId),
        eq(tables.personalizedNamingSchemes.lobbyId, lobby.id)
      )
    });

    if (personalizedScheme) namingScheme = personalizedScheme.pattern;
  }

  return namingScheme;
});