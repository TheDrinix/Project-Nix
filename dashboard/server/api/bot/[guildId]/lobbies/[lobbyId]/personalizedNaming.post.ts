import { z } from "zod";

const personalizedNamingSchema = z.object({
  userId: z.string(),
  pattern: z.string().max(50).optional()
});

export default defineEventHandler(async event => {
  const guildId = getRouterParam(event, 'guildId');
  const lobbyId = getRouterParam(event, 'lobbyId');

  const res = await readValidatedBody(event, b => personalizedNamingSchema.safeParse(b));

  if (!res.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid Body'
    });
  }
  
  if (!guildId || !lobbyId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Guild ID and Lobby ID are required'
    });
  }

  const lobby = await useDrizzle().query.lobbies.findFirst({
    where: and(
      eq(tables.lobbies.guildId, guildId),
      eq(tables.lobbies.entryPointId, lobbyId)
    )
  });

  if (!lobby) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Lobby not Found'
    });
  }

  if (!lobby.allowPersonalizedNaming) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Personalized naming is not allowed in this lobby'
    });
  }

  const { userId, pattern } = res.data;

  if (!pattern) {
    await useDrizzle().delete(tables.personalizedNamingSchemes).where(
      and(
        eq(tables.personalizedNamingSchemes.lobbyId, lobby.id),
        eq(tables.personalizedNamingSchemes.memberId, userId)
      )
    );
    return;
  }

  return useDrizzle().insert(tables.personalizedNamingSchemes).values({
    memberId: userId,
    lobbyId: lobby.id,
    pattern
  }).onConflictDoUpdate({
    target: [tables.personalizedNamingSchemes.lobbyId, tables.personalizedNamingSchemes.memberId],
    set: {
      pattern
    }
  }).returning().then((s) => {s[0]!});
});