import prisma from "~/lib/prisma";
import {z} from 'zod';

const protectSchema = z.object({
  channelId: z.string(),
});

export default defineEventHandler(async event => {
  const guildId = getRouterParam(event, 'guildId');
  const lobbyId = getRouterParam(event, 'lobbyId');

  const res = await readValidatedBody(event, b => protectSchema.safeParse(b));

  if (!res.success) {
    throw createError({
      statusCode: 400,
      name: 'Invalid request body',
      message: res.error.errors.map(err => err.message).join('\n')
    });
  }

  const { channelId } = res.data;

  const lobby = await prisma.lobby.findFirst({
    where: {
      guildId: guildId,
      id: lobbyId
    }
  });

  if (!lobby) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Lobby not Found'
    });
  }

  if (channelId === lobby.entryPointId || channelId === lobby.waitingRoomId) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Cannot remove protection from entry point or waiting room'
    });
  }

  const protectedChannelIds = lobby.protectedChannelIds;
  const isProtected = !protectedChannelIds.includes(channelId)
  if (!isProtected) {
    protectedChannelIds.filter(id => id !== channelId);
  } else {
    protectedChannelIds.push(channelId);
  }

  const updatedLobby = await prisma.lobby.update({
    where: {
      id: lobby.id
    },
    data: {
      protectedChannelIds: {
        set: protectedChannelIds
      }
    }
  });

  return {
    lobby: updatedLobby,
    isProtected,
    channelId
  }
});