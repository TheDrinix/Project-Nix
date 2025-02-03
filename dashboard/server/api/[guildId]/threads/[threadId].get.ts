import prisma from "~/lib/prisma";

export default defineEventHandler(async event => {
  const guildId = getRouterParam(event, 'guildId');
  const threadId = getRouterParam(event, 'threadId');

  const thread = await prisma.watchedThread.findFirst({
    where: {
      guildId,
      id: threadId,
    }
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