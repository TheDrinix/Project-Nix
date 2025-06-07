
export default defineEventHandler(event => {
  return useDrizzle().query.guilds.findMany();
})