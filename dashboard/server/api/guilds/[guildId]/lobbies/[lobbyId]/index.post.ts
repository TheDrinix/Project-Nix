import { dashboardCreateLobbySchema } from 'shared';
import { useGuildService } from '~/server/services/guild.service';
import { useLobbyService } from '~/server/services/lobby.service';
import { createApiError, createValidationError } from '~/server/utils/apiError';
import { defineGuildEventHandler } from '~/server/utils/defineGuildEventHandler';

export default defineGuildEventHandler(async ({ event, guildId }) => {
  const lobbyId = getRouterParam(event, 'lobbyId');

  if (!lobbyId) {
    throw createApiError({
      statusCode: 400,
      message: 'Lobby ID is required'
    });
  }

  const res = await readValidatedBody(event, b => dashboardCreateLobbySchema.safeParse(b));

  if (!res.success) {
    throw createValidationError(res.error.errors.map(err => err.message).join('\n'));
  }

  const guild = await useGuildService().getById(guildId);

  if (!guild) {
    throw createApiError({
      statusCode: 404,
      message: 'Guild not found'
    });
  }

  const existingLobby = await useLobbyService().findConflictingLobby(res.data.entryPointId, lobbyId);

  if (existingLobby) {
    throw createApiError({
      statusCode: 409,
      message: 'Lobby already exists'
    });
  }

  return useLobbyService().create({
    id: lobbyId,
    guildId,
    entryPointId: res.data.entryPointId,
    namingScheme: res.data.namingScheme,
    allowPersonalizedNaming: res.data.allowPersonalizedNaming,
    protectedChannelIds: res.data.protectedChannelIds.length > 0 ? res.data.protectedChannelIds : [],
    waitingRoomId: res.data.waitingRoomId
  });
});
