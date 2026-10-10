import { botCreateLobbySchema } from 'shared';
import { useGuildService } from '~/server/services/guild.service';
import { useLobbyService } from '~/server/services/lobby.service';
import { createApiError, createValidationError, isDatabaseUniqueViolation } from '~/server/utils/apiError';
import { defineGuildEventHandler } from '~/server/utils/defineGuildEventHandler';

export default defineGuildEventHandler(async ({ event, guildId }) => {
  const res = await readValidatedBody(event, b => botCreateLobbySchema.safeParse(b));

  if (!res.success) {
    throw createValidationError(
      res.error.errors.map(err => `${err.path.join(', ')} => ${err.message}`).join('\n')
    );
  }

  const guild = await useGuildService().getById(guildId);

  if (!guild) {
    throw createApiError({
      statusCode: 404,
      message: 'Guild not found'
    });
  }

  try {
    const { lobbyId, entrypointId, waitingRoomId, allowPersonalizedNaming, namingScheme, protectedChannelIds } = res.data;

    return useLobbyService().create({
      id: lobbyId,
      guildId: guild.id,
      entryPointId: entrypointId,
      waitingRoomId,
      allowPersonalizedNaming,
      namingScheme,
      protectedChannelIds
    });
  } catch (error) {
    if (isDatabaseUniqueViolation(error)) {
      throw createApiError({
        statusCode: 409,
        message: 'Lobby already exists'
      });
    }

    throw createApiError({
      statusCode: 500,
      message: 'Internal server error'
    });
  }
});
