import { botCreateLobbySchema } from 'shared';
import { useGuildService } from '~/server/services/guild.service';
import { useLobbyService } from '~/server/services/lobby.service';
import { createApiError, createValidationError } from '~/server/utils/apiError';

export default defineEventHandler(async event => {
  const guildId = getRouterParam(event, 'guildId');
  const res = await readValidatedBody(event, body => botCreateLobbySchema.safeParse(body));

  if (!res.success) {
    throw createValidationError(res.error.errors.map(err => err.message).join('\n'));
  }

  if (!guildId) {
    throw createApiError({
      statusCode: 404,
      message: 'Guild not found'
    });
  }

  const guild = await useGuildService().getById(guildId);

  if (!guild) {
    throw createApiError({
      statusCode: 404,
      message: 'Guild not found'
    });
  }

  const { lobbyId, entrypointId, waitingRoomId, allowPersonalizedNaming, namingScheme, protectedChannelIds } = res.data;

  const existingLobby = await useLobbyService().findById(lobbyId);

  if (existingLobby) {
    throw createApiError({
      statusCode: 409,
      message: 'Lobby already exists'
    });
  }

  return useLobbyService().create({
    id: lobbyId,
    entryPointId: entrypointId,
    guildId: guild.id,
    waitingRoomId,
    allowPersonalizedNaming,
    namingScheme,
    protectedChannelIds
  });
});
