import { APIEmbed, EmbedBuilder, Guild, User } from "discord.js";
import api from "./api";

export const fillPlaceholders = (messageTemplate: string, guild: Guild, user: User) => {
  const guildIconUrl = guild.iconURL() || 'https://cdn.discordapp.com/embed/avatars/0.png';
  const userAvatarUrl = user.displayAvatarURL() || 'https://cdn.discordapp.com/embed/avatars/0.png';

  return messageTemplate
    .replaceAll('{user}', `<@${user.id}>`)
    .replaceAll('{username}', user.displayName)
    .replaceAll('{guild}', guild.name)
    .replaceAll('{guild_icon}', guildIconUrl)
    .replaceAll('{user_avatar}', userAvatarUrl)
    .replaceAll(/\{@(\d+)\}/g, '<@$1>')     // Mention user by ID
    .replaceAll(/\{#(\d+)\}/g, '<#$1>')     // Mention channel by ID
    .replaceAll(/\{&(\d+)\}/g, '<@&$1>')    // Mention role by ID
    .replaceAll('{everyone}', '@everyone')  // Mention everyone
    .replaceAll('{here}', '@here');         // Mention here
}

export const handleAnnouncementMessage = async (eventType: 'join' | 'leave' | 'ban', guild: Guild, user: User) => {
  const config = await api.getAnnouncementsConfig(guild.id, eventType);

    if (!config) return;

    const filledMsg = fillPlaceholders(config.messageTemplate, guild, user)
    const embed: APIEmbed = JSON.parse(filledMsg);

    const embedWithTimestamp = EmbedBuilder
      .from(embed)
      .setTimestamp();

    const channel = await guild.channels.fetch(config.channelId);
    if (!channel || !channel.isTextBased()) return;
    
    channel.send({ embeds: [embedWithTimestamp] })
}