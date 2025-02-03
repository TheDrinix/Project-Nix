import prisma from "~/lib/prisma";

export default defineEventHandler(async event => {
  const threadId = getRouterParam(event, 'threadId');

  await prisma.watchedThread.delete({
    where: {
      id: threadId
    }
  });
});