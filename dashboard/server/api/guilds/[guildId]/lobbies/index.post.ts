import { z } from 'zod';
import prisma from '~/lib/prisma';
import { Prisma } from '@prisma/client';

const lobbySchema = z.object({
  lobbyId: z.string().nonempty(),
  entrypointId: z.string().nonempty(),
  waitingRoomId: z.string().nullable(),
  allowPersonalizedNaming: z.boolean().default(false),
  namingScheme: z.string().min(3).max(50),
  protectedChannelIds: z.array(z.string().nonempty()),
});

export default defineEventHandler(async event => {
  const guildId = getRouterParam(event, 'guildId');

  if (!guildId) {
    throw createError({
      message: 'Guild ID is required',
      status: 400
    });
  }

  const res = await readValidatedBody(event, b => lobbySchema.safeParse(b));

  if (!res.success) {
    console.log(res.error.errors);

    throw createError({
      statusCode: 400,
      name: 'Invalid request body',
      message: res.error.errors.map(err => `${err.path.join(', ')} => ${err.message}`).join('\n'),
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

  try {
    const { lobbyId, entrypointId, waitingRoomId, allowPersonalizedNaming, namingScheme, protectedChannelIds } = res.data;

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
    })
  } catch(e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2002') {
        throw createError({
          statusCode: 409,
          statusMessage: 'Lobby already exists'
        });
      }
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error'
    });
  }
})