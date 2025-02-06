import prisma from "~/lib/prisma";
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

  if (!lobby.allowPersonalizedNaming) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Personalized naming is not allowed in this lobby'
    });
  }

  const { userId, pattern } = res.data;

  if (!pattern) {
    return prisma.personalizedNamingScheme.delete({
      where: {
        lobbyId_memberId: {
          lobbyId: lobby.id,
          memberId: userId
        }
      }
    });
  }

  return prisma.personalizedNamingScheme.upsert({
    where: {
      lobbyId_memberId: {
        lobbyId: lobby.id,
        memberId: userId
      }
    },
    update: {
      pattern
    },
    create: {
      memberId: userId,
      lobbyId: lobby.id,
      pattern
    }
  });
});