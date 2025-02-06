import prisma from "~/lib/prisma";
import { z } from "zod";

const threadSchema = z.object({
  channelId: z.string(),
  parentId: z.string(),
});
 
export default defineEventHandler(async event => {
  const guildId = getRouterParam(event, "guildId");
  const res = await readValidatedBody(event, b => threadSchema.safeParse(b));

  if (!guildId) {
    throw createError({
      statusCode: 400,
      name: "Invalid guild ID",
      message: "Invalid guild ID",
    });
  }

  if (!res.success) {
    throw createError({
      statusCode: 400,
      name: "Invalid request body",
      message: res.error.errors.map(err => err.message).join("\n"),
    });
  }

  const { channelId, parentId } = res.data;

  let thread = await prisma.watchedThread.findFirst({
    where: {
      guildId,
      id: channelId,
    }
  });

  if (!thread) {
    thread = await prisma.watchedThread.create({
      data: {
        id: channelId,
        guildId,
        parentId
      }
    });
  } else {
    prisma.watchedThread.delete({
      where: {
        id: channelId
      }
    });
  }

  return {
    watchedThread: thread,
    isWatched: !thread
  }
});