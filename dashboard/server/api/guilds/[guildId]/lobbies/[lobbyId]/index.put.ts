import prisma from '~/lib/prisma';
import { z } from 'zod';

const updateLobbySchema = z.object({
  namingScheme: z.string().min(3).max(50),
  entryPointId: z.string(),
  waitingRoomId: z.string().nullable(),
  allowPersonalizedNaming: z.boolean(),
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

  const session = await requireUserSession(event);

  if (!session.secure) {
    throw createError({
      message: 'Unauthorized',
      status: 401
    });
  }

  const res = await readValidatedBody(event, b => updateLobbySchema.safeParse(b));

  if (!res.success) {
    throw createError({
      statusCode: 400,
      name: 'Invalid request body',
      message: res.error.errors.map(err => err.message).join('\n')
    });
  }

  const { namingScheme, entryPointId, waitingRoomId, allowPersonalizedNaming } = res.data;

  await checkUsersGuildPermissions(session.user.discordId, guildId, session.secure.discord.accessToken);

  const lobby = await prisma.lobby.findFirst({
    where: {
      id: lobbyId,
      guildId
    }
  });

  if (!lobby) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Lobby not found'
    });
  }

  return prisma.lobby.update({
    where: {
      id: lobbyId
    },
    data: {
      namingScheme,
      entryPointId,
      waitingRoomId,
      allowPersonalizedNaming,
      isPrivate: !!waitingRoomId
    }
  });
});