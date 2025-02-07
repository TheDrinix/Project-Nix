declare module '#auth-utils' {
  interface User {
    discordId: string;
    username: string;
    avatar?: string;
  }

  interface SecureSessionData {
    discord: {
      accessToken: string;
      refreshToken: string;
    };
  }
}

export interface DiscordOAuthUser {
  id: string;
  username: string;
  avatar?: string;
  discriminator: string;
  global_name: string;
  email: string;
  verified: boolean;
}

export interface DiscordOAuthTokens {
  token_type: string;
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

export interface DiscordOAuthData {
  user: DiscordOAuthUser;
  tokens: DiscordOAuthTokens;
}