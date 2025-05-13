import prisma from '~/lib/prisma';
import { z } from 'zod';
import { embedSchema } from '~/utils/embed';
import { Embed } from '~/types/embed';

const embedConfigSchema = z
  .object({
    enabled: z.boolean(),
    embed: embedSchema.optional(),
  })
  .refine((data) => data.enabled || !data.embed, {
    message: 'Embed must be provided if enabled is true',
  });

const announcementsSchema = z.object({
  channelId: z.string().optional(),
  join: embedConfigSchema,
  leave: embedConfigSchema,
  ban: embedConfigSchema,
});

export default defineEventHandler(async (event) => {
  const cache = useStorage('cache');
  await requireUserSession(event);

  const guildId = getRouterParam(event, 'guildId');

  if (!guildId) {
    throw createError({
      message: 'Guild ID is required',
      status: 400,
    });
  }

  const body = await readValidatedBody(event, (b) =>
    announcementsSchema.safeParse(b),
  );
  if (!body.success) {
    throw createError({
      message: 'Invalid request body',
      status: 400,
      data: body.error.flatten(),
    });
  }

  const currentConfig = await prisma.announcementsConfig.findFirst({
    where: {
      guildId: guildId,
    },
  });

  await Promise.all([
    cache.removeItem(`nitro:handlers:guild-announcements-config:${guildId}-join`),
    cache.removeItem(`nitro:handlers:guild-announcements-config:${guildId}-leave`),
    cache.removeItem(`nitro:handlers:guild-announcements-config:${guildId}-ban`)
  ])

  if (!currentConfig) {
    if (!body.data.channelId) {
      throw createError({
        message: 'Channel ID is required for new announcement configs',
        status: 400,
      });
    }

    const joinEmbed: Embed = {
      title: 'User Joined',
      description: 'Welcome {user} to the server!',
      fields: [],
      color: 0xc27aff,
      ...body.data.join.embed,
    };

    const leaveEmbed: Embed = {
      title: 'User Left',
      description: 'Goodbye {user} from the server!',
      fields: [],
      color: 0xc27aff,
      ...body.data.leave.embed,
    };

    const banEmbed: Embed = {
      title: 'User Banned',
      description: 'User {user} was banned from the server!',
      ...body.data.ban.embed,
      fields: [],
      color: 0xc27aff,
    };

    return await prisma.announcementsConfig.create({
      data: {
        guildId: guildId,
        channelId: body.data.channelId,
        announceJoin: body.data.join.enabled,
        joinMessageEmbed: JSON.stringify(joinEmbed),
        announceLeave: body.data.leave.enabled,
        leaveMessageEmbed: JSON.stringify(leaveEmbed),
        announceBan: body.data.ban.enabled,
        banMessageEmbed: JSON.stringify(banEmbed),
      },
    });
  }

  return await prisma.announcementsConfig.update({
    where: {
      guildId,
    },
    data: {
      channelId: body.data.channelId,
      announceJoin: body.data.join.enabled,
      joinMessageEmbed: body.data.join.embed
        ? JSON.stringify(body.data.join.embed)
        : undefined,
      announceLeave: body.data.leave.enabled,
      leaveMessageEmbed: body.data.leave.embed
        ? JSON.stringify(body.data.leave.embed)
        : undefined,
      announceBan: body.data.ban.enabled,
      banMessageEmbed: body.data.ban.embed
        ? JSON.stringify(body.data.ban.embed)
        : undefined,
    },
  });
});