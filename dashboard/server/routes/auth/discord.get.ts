import { type DiscordOAuthData } from "~/types/auth";

export default defineOAuthDiscordEventHandler({
  config: {
    emailRequired: true,
    profileRequired: true,
    scope: ['identify', 'email', 'guilds']
  },
  async onSuccess(event, { user, tokens }: DiscordOAuthData) {
    await setUserSession(event, {
      user: {
        discordId: user.id
      },
      secure: {
        discord: {
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token
        }
      }
    }, {
      maxAge: tokens.expires_in
    });

    return sendRedirect(event, '/guilds');
  },
  onError(event, error) {
    console.error("Discord OAuth error: ", error);

    return sendRedirect(event, '/');
  }
})