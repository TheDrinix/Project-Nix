import prisma from "~/lib/prisma";
import { z } from "zod";

const lobbySchema = z.object({
  lobbyId: z.string(),
  entrypointId: z.string(),
  guildId: z.string(),
  waitingRoomId: z.string().optional(),
  allowPersonalizedNaming: z.boolean(),
  namingScheme: z.string().min(3).max(50)
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

  const guild = await prisma.guild.findFirst({
    where: {
      id: guildId
    }
  });

  if (!guild) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Guild not Found'
    });
  }

  const { lobbyId, entrypointId, waitingRoomId, allowPersonalizedNaming, namingScheme } = res.data;

  const protectedChannelIds = [entrypointId];
  if (!!waitingRoomId) protectedChannelIds.push(waitingRoomId); 

  return prisma.lobby.create({
    data: {
      id: lobbyId,
      entryPointId: entrypointId,
      guildId: guild.id,
      isPrivate: !!waitingRoomId,
      waitingRoomId: waitingRoomId,
      allowPersonalizedNaming: allowPersonalizedNaming,
      namingScheme: namingScheme,
      protectedChannelIds: {
        set: protectedChannelIds
      }
    }
  });
});
