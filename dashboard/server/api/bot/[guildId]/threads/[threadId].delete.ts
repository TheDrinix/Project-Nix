import { useThreadService } from '~/server/services/thread.service';

export default defineEventHandler(async event => {
  const threadId = getRouterParam(event, 'threadId');

  if (!threadId) return;

  await useThreadService().deleteById(threadId);
});
