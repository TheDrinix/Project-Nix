export default defineEventHandler(async event => {
  const guildId = getRouterParam(event, 'guildId');
  const threadId = getRouterParam(event, 'threadId');

  if (!guildId || !threadId) {
    throw createError({
      statusCode: 404,
      name: "Not found",
      message: "Thread not found",
    });
  }

  const thread =  await useDrizzle().query.watchedThreads.findFirst({
    where: and(
      eq(tables.watchedThreads.guildId, guildId),
      eq(tables.watchedThreads.id, threadId)
    )
  });

  if (!thread) {
    throw createError({
      statusCode: 404,
      name: "Not found",
      message: "Thread not found",
    });
  }

  return thread;
});