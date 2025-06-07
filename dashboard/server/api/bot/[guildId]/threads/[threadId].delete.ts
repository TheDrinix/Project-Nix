export default defineEventHandler(async event => {
  const threadId = getRouterParam(event, 'threadId');

  if (!threadId) return;

  await useDrizzle().delete(tables.watchedThreads).where(
    eq(tables.watchedThreads.id, threadId)
  );
});