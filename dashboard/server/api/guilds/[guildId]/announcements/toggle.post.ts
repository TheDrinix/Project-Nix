import { z } from "zod";

const announcementsToggleSchema = z.object({
  type: z.enum(['join', 'leave', 'ban']),
  enabled: z.boolean(),
})

export default defineEventHandler(async (event) => {
  const guildId = getRouterParam(event, 'guildId');

  if (!guildId) {
    throw createError({
      message: 'Guild ID is required',
      status: 400,
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

  const body = await readValidatedBody(event, (b) => announcementsToggleSchema.safeParse(b));

  if (!body.success) {
    throw createError({
      message: 'Invalid request body',
      status: 400,
      data: body.error.flatten(),
    });
  }

  const { type, enabled } = body.data;

  const config = await useDrizzle().query.announcementsConfigs.findFirst({
    where: eq(tables.announcementsConfigs.guildId, guildId),
  });

  if (!config) {
    await createDefaultAnnouncementsConfig(guildId);
  }

  const updatedConfig = await useDrizzle().update(tables.announcementsConfigs)
    .set({ [`announce${type.charAt(0).toUpperCase() + type.slice(1)}`]: enabled })
    .where(eq(tables.announcementsConfigs.guildId, guildId))
    .returning();

  return updatedConfig[0] || null;
})
