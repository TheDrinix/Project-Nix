export default defineEventHandler(async event => {
  if (!event.path.startsWith('/api/bot')) return;

  const unauthorized = createError({
    statusCode: 401,
    statusMessage: 'Unauthorized'
  });

  const authHeader = getHeader(event, 'Authorization');

  if (!authHeader) throw unauthorized;

  const [tokenType, token] = authHeader.split(' ');
  const config = useRuntimeConfig();

  if (tokenType.toLowerCase() != 'bot' || token != config.apiKey) throw unauthorized;
})