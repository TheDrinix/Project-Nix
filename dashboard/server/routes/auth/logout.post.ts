export default defineEventHandler(async (event) => {
  const session = await requireUserSession(event);

  if (!session.secure) return;

  const config = useRuntimeConfig();
  const { oauthDiscordClientId, oauthDiscordClientSecret } = config;

  if (!oauthDiscordClientId || !oauthDiscordClientSecret) throw createError({
    message: 'Discord OAuth is not configured',
    status: 500
  });

  console.log()

  const body = new URLSearchParams({
    token: session.secure.discord.accessToken,
    token_type_hint: 'access_token',
    client_id: oauthDiscordClientId,
    client_secret: oauthDiscordClientSecret
  });

  await $fetch('https://discord.com/api/oauth2/token/revoke', {
    method: 'POST',
    body,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })

  await clearUserSession(event);
})