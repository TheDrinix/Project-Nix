class LobbyService {
  async listByGuild(guildId: string) {
    return useDrizzle().query.lobbies.findMany({
      where: eq(tables.lobbies.guildId, guildId)
    });
  }

  async findByGuildAndId(guildId: string, lobbyId: string) {
    return useDrizzle().query.lobbies.findFirst({
      where: and(eq(tables.lobbies.id, lobbyId), eq(tables.lobbies.guildId, guildId))
    });
  }

  async findById(lobbyId: string) {
    return useDrizzle().query.lobbies.findFirst({
      where: eq(tables.lobbies.id, lobbyId)
    });
  }

  async findConflictingLobby(entryPointId: string, lobbyId: string) {
    return useDrizzle().query.lobbies.findFirst({
      where: or(eq(tables.lobbies.entryPointId, entryPointId), eq(tables.lobbies.id, lobbyId))
    });
  }

  async create(input: {
    id: string;
    guildId: string;
    entryPointId: string;
    waitingRoomId?: string | null;
    namingScheme: string;
    allowPersonalizedNaming: boolean;
    protectedChannelIds: string[];
  }) {
    return useDrizzle()
      .insert(tables.lobbies)
      .values({
        id: input.id,
        guildId: input.guildId,
        entryPointId: input.entryPointId,
        isPrivate: !!input.waitingRoomId,
        waitingRoomId: input.waitingRoomId ?? null,
        namingScheme: input.namingScheme,
        allowPersonalizedNaming: input.allowPersonalizedNaming,
        protectedChannelIds: input.protectedChannelIds
      })
      .returning()
      .then(rows => rows[0] ?? null);
  }

  async update(guildId: string, lobbyId: string, input: {
    namingScheme: string;
    entryPointId: string;
    waitingRoomId: string | null;
    allowPersonalizedNaming: boolean;
  }) {
    const rows = await useDrizzle()
      .update(tables.lobbies)
      .set({
        namingScheme: input.namingScheme,
        entryPointId: input.entryPointId,
        waitingRoomId: input.waitingRoomId,
        allowPersonalizedNaming: input.allowPersonalizedNaming,
        isPrivate: !!input.waitingRoomId
      })
      .where(and(eq(tables.lobbies.id, lobbyId), eq(tables.lobbies.guildId, guildId)))
      .returning();

    return rows[0] ?? null;
  }

  async deleteById(lobbyId: string) {
    return useDrizzle().delete(tables.lobbies).where(eq(tables.lobbies.id, lobbyId)).execute();
  }
}

const lobbyService = new LobbyService();

export function useLobbyService() {
  return lobbyService;
}
