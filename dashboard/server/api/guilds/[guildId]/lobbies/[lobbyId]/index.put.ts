import { dashboardUpdateLobbySchema } from 'shared';
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

  const res = await readValidatedBody(event, b => dashboardUpdateLobbySchema.safeParse(b));

  if (!res.success) {
    throw createValidationError(res.error.errors.map(err => err.message).join('\n'));
  }

  const lobby = await useLobbyService().findByGuildAndId(guildId, lobbyId);

  if (!lobby) {
    throw createApiError({
      statusCode: 404,
      message: 'Lobby not found'
    });
  }

  return useLobbyService().update(guildId, lobbyId, res.data);
});
