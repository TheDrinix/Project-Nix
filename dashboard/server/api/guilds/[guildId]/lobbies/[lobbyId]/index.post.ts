import { z } from 'zod';

const createLobbySchema = z.object({
  entryPointId: z.string(),
  namingScheme: z.string().min(3).max(50),
  allowPersonalizedNaming: z.boolean(),
  protectedChannelIds: z.array(z.string()),
  waitingRoomId: z.string().nullable(),
});

export default defineEventHandler(async event => {
  const guildId = getRouterParam(event, 'guildId');
  const lobbyId = getRouterParam(event, 'lobbyId');

  if (!guildId || !lobbyId) {
    throw createError({
      message: 'Guild ID and Lobby ID are required',
      status: 400
    });
  }

  const res = await readValidatedBody(event, b => createLobbySchema.safeParse(b));

  if (!res.success) {
    throw createError({
      statusCode: 400,
      name: 'Invalid request body',
      message: res.error.errors.map(err => err.message).join('\n')
    });
  }

  const session = await requireUserSession(event);

  if (!session.secure) {
    throw createError({
      message: 'Unauthorized',
      status: 401
    });
  }

  await checkUsersGuildPermissions(session.user.discordId, guildId, session.secure.discord.accessToken);

  const guild = await useDrizzle().query.guilds.findFirst({
    where: eq(tables.guilds.id, guildId)
  });

  if (!guild) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Guild not Found'
    });
  }

  const { entryPointId, namingScheme, allowPersonalizedNaming, protectedChannelIds, waitingRoomId } = res.data;

  const existingLobby = await useDrizzle().query.lobbies.findFirst({
    where: or(
      eq(tables.lobbies.entryPointId, entryPointId),
      eq(tables.lobbies.id, lobbyId)
    )
  });

  if (existingLobby) {
    throw createError({
      statusCode: 409,
      statusMessage: 'Lobby already exists'
    });
  }

  return useDrizzle().insert(tables.lobbies).values({
    id: lobbyId,
    guildId,
    entryPointId,
    namingScheme,
    allowPersonalizedNaming,
    protectedChannelIds: protectedChannelIds.length > 0 ? protectedChannelIds : [],
    waitingRoomId
  });
});