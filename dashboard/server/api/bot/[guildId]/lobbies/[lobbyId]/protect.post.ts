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

  if (!guildId || !lobbyId) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Guild or Lobby not Found'
    });
  }

  const lobby = await useDrizzle().query.lobbies.findFirst({
    where: and(
      eq(tables.lobbies.guildId, guildId),
      eq(tables.lobbies.id, lobbyId)
    )
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

  let protectedChannelIds = lobby.protectedChannelIds;
  const isProtected = protectedChannelIds.includes(channelId)
  if (isProtected) {
    protectedChannelIds = protectedChannelIds.filter(id => id !== channelId);
  } else {
    protectedChannelIds.push(channelId);
  }

  const updatedLobby = await useDrizzle().update(tables.lobbies).set({
    protectedChannelIds: protectedChannelIds
  }).where(
    and(
      eq(tables.lobbies.guildId, guildId),
      eq(tables.lobbies.id, lobbyId)
    )
  ).returning().then(rows => rows[0]!);

  return {
    lobby: updatedLobby,
    isProtected: !isProtected,
    channelId
  }
});