import { z } from "zod";

const channelSchema = z.object({
  channelId: z.string().min(1, "Channel ID is required"),
});

export default defineEventHandler(async (event) => {
  const guildId = getRouterParam(event, 'guildId');

  if (!guildId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Guild ID is required',
    });
  }

  const session = await requireUserSession(event);

  if (!session.secure) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    });
  }

  await checkUsersGuildPermissions(session.user.discordId, guildId, session.secure.discord.accessToken);

  const body = await readValidatedBody(event, (b) => channelSchema.safeParse(b));

  if (!body.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request body',
      data: body.error.flatten(),
    });
  }

  const { channelId } = body.data;

  const config = await useDrizzle().query.announcementsConfigs.findFirst({
    where: eq(tables.announcementsConfigs.guildId, guildId),
  });

  if (!config) {
    await createDefaultAnnouncementsConfig(guildId);
  }

  const updatedConfig = await useDrizzle().update(tables.announcementsConfigs)
    .set({ channelId })
    .where(eq(tables.announcementsConfigs.guildId, guildId))
    .returning();

  return updatedConfig[0] || null;
})
