import { z } from "zod";

const lobbySchema = z.object({
  lobbyId: z.string(),
  entrypointId: z.string(),
  guildId: z.string(),
  waitingRoomId: z.string().optional(),
  allowPersonalizedNaming: z.boolean(),
  namingScheme: z.string().min(3).max(50),
  protectedChannelIds: z.array(z.string())
});

export default defineEventHandler(async event => {
  const guildId = getRouterParam(event, 'guildId');

  const res = await readValidatedBody(event, b => lobbySchema.safeParse(b));

  if (!res.success) {
    throw createError({
      statusCode: 400,
      name: 'Invalid request body',
      message: res.error.errors.map(err => err.message).join('\n')
    });
  }

  if (!guildId) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Guild not Found'
    });
  }

  const guild = await useDrizzle().query.guilds.findFirst({
    where: eq(tables.guilds.id, guildId)
  });

  if (!guild) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Guild not Found'
    });
  }

  const { lobbyId, entrypointId, waitingRoomId, allowPersonalizedNaming, namingScheme, protectedChannelIds } = res.data;

  const existingLobby = await useDrizzle().query.lobbies.findFirst({
    where: eq(tables.lobbies.id, lobbyId)
  });

  if (existingLobby) {
    throw createError({
      statusCode: 409,
      statusMessage: 'Lobby already exists'
    });
  }

  return useDrizzle().insert(tables.lobbies).values({
    id: lobbyId,
    entryPointId: entrypointId,
    guildId: guild.id,
    isPrivate: !!waitingRoomId,
    waitingRoomId: waitingRoomId,
    allowPersonalizedNaming: allowPersonalizedNaming,
    namingScheme: namingScheme,
    protectedChannelIds: protectedChannelIds
  }).returning().then(rows => rows[0]!);
});
