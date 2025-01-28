import prisma from "~/lib/prisma";
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

  const guild = await prisma.guild.findFirst({
    where: {
      id: guildId
    }
  });

  if (!guild) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Guild not Found'
    });
  }

  const { roleId } = res.data;

  prisma.guild.update({
    where: {
      id: guildId
    },
    data: {
      PNRole: roleId
    }
  });
})