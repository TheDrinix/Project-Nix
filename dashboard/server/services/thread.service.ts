class ThreadService {
  async listByGuild(guildId: string) {
    return useDrizzle().query.watchedThreads.findMany({
      where: eq(tables.watchedThreads.guildId, guildId)
    });
  }

  async findByGuildAndThreadId(guildId: string, threadId: string) {
    return useDrizzle().query.watchedThreads.findFirst({
      where: and(eq(tables.watchedThreads.guildId, guildId), eq(tables.watchedThreads.id, threadId))
    });
  }

  async toggleWatch(guildId: string, threadId: string, parentId: string) {
    const existing = await this.findByGuildAndThreadId(guildId, threadId);

    if (!existing) {
      const watchedThread = await useDrizzle()
        .insert(tables.watchedThreads)
        .values({ id: threadId, guildId, parentId })
        .returning()
        .then(rows => rows[0]!);

      return {
        watchedThread,
        isWatched: true
      };
    }

    await useDrizzle().delete(tables.watchedThreads).where(eq(tables.watchedThreads.id, threadId));

    return {
      watchedThread: existing,
      isWatched: false
    };
  }

  async deleteById(threadId: string) {
    await useDrizzle().delete(tables.watchedThreads).where(eq(tables.watchedThreads.id, threadId));
  }
}

const threadService = new ThreadService();

export function useThreadService() {
  return threadService;
}
