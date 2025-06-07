import { z } from "zod";

const permissionsSchema = z.object({
  roleId: z.string().optional()
});

export default defineEventHandler(async event => {
  const guildId = getRouterParam(event, 'guildId');
  const res = await readValidatedBody(event, q => permissionsSchema.safeParse(q));

  if (!res.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid body'
    });
  }

  if (!guildId) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Guild not Found'
    });
  }
  
  const guild = await useDrizzle().query.guilds.findFirst({
    where: eq(tables.guilds.id, guildId)
  });

  if (!guild) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Guild not Found'
    });
  }

  const { roleId } = res.data;

  await useDrizzle().update(tables.guilds).set({
    PNRole: roleId
  }).where(eq(tables.guilds.id, guildId));
})