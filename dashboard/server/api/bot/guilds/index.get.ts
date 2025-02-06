import prisma from '~/lib/prisma'

export default defineEventHandler(event => {
  return prisma.guild.findMany();
})