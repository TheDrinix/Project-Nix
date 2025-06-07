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

  let thread = await useDrizzle().query.watchedThreads.findFirst({
    where: and(eq(tables.watchedThreads.guildId, guildId), eq(tables.watchedThreads.id, channelId))
  });
  let isWatched: boolean;

  if (!thread) {
    // If thread is not watched, start watching it
    thread = await useDrizzle().insert(tables.watchedThreads).values({
      id: channelId,
      guildId,
      parentId
    }).returning().then(rows => rows[0]!);

    isWatched = true;
  } else {
    await useDrizzle().delete(tables.watchedThreads).where(
      eq(tables.watchedThreads.id, channelId)
    );

    isWatched = false;
  }

  return {
    watchedThread: thread!,
    isWatched
  }
});