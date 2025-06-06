export const getUserAvatarUrl = (userId: string, avatar?: string): string => {
  return avatar ? `https://cdn.discordapp.com/avatars/${userId}/${avatar}.png` : `https://cdn.discordapp.com/embed/avatars/${parseInt(userId) % 5}.png`;
}