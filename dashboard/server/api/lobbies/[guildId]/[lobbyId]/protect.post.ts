import prisma from "~/lib/prisma";
import {z} from 'zod';

const protectSchema = z.object({
  channelId: z.string(),
  categoryId: z.string(),
});

export default defineEventHandler(async event => {
  const guildId = getRouterParam(event, 'guildId');
  const lobbyId = getRouterParam(event, 'lobbyId');

  const lobby = await prisma.lobby.findFirst({
    where: {
      guildId: guildId,
      entryPointId: lobbyId
    }
  });

  if (!lobby) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Lobby not Found'
    });
  }

  const res = await readValidatedBody(event, b => protectSchema.safeParse(b));

  if (!res.success) {
    throw createError({
      statusCode: 400,
      name: 'Invalid request body',
      message: res.error.errors.map(err => err.message).join('\n')
    });
  }

  const { channelId, categoryId } = res.data;

  if (lobby.id !== categoryId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'The channel is not within a lobby'
    });
  }

  const protectedChannelIds = lobby.protectedChannelIds;
  if (protectedChannelIds.includes(channelId)) {
    protectedChannelIds.filter(id => id !== channelId);
  } else {
    protectedChannelIds.push(channelId);
  }

  return prisma.lobby.update({
    where: {
      id: lobby.id
    },
    data: {
      protectedChannelIds: {
        set: protectedChannelIds
      }
    }
  });
});