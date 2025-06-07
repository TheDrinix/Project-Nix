import { EmbedBuilder } from "discord.js";
import { ChannelType, VoiceState } from "discord.js";
import api from "./api";
import { Lobby } from "../types/api";

async function getLobbyChannelName(lobby: Lobby, username: string, channelCount: number) {
  const name = lobby.namingScheme
    .replaceAll('{user}', username)
    .replaceAll('{p_user}', username + "'s")
    .replaceAll('{c}', `${channelCount - lobby.protectedChannelIds.length + 1}`);

  return name;
}

export async function createLobbyChannel(after: VoiceState) {
  if (!after.channel || !after.channel.parentId || !after.member) return;

  let lobby: Lobby;
  try {
    lobby = await api.getLobbyByLobbyId(after.guild.id, after.channel.parentId, after.member.id);
  } catch (e) {
    return;
  }

  const channelId = after.channel.id;

  if (channelId !== lobby.entryPointId || (lobby.isPrivate && channelId !== lobby.waitingRoomId)) return;

  if (channelId === lobby.waitingRoomId) {
    const embed = new EmbedBuilder()
      .setColor(0x5d00ff)
      .setTitle('Join private room')
      .setDescription(
        'To join someones private room send a commad: /join *channel_code*'
      )
      .setTimestamp();

    await after.member.send({ embeds: [embed] });
    return;
  }

  if (!after.channel.parent) return;

  const name = await getLobbyChannelName(lobby, after.member.displayName, after.channel.parent.children.cache.size);

  const newChannel = await after.channel.parent.children.create({
    name,
    type: ChannelType.GuildVoice,
  });

  await after.member.voice.setChannel(newChannel);

  if (lobby.isPrivate) {
    // Remove permission for everyone to view the channel
    await newChannel.permissionOverwrites.edit(after.guild.roles.everyone, {
      ViewChannel: false,
    });
    // Allow the member to view the channel for the member
    await newChannel.permissionOverwrites.edit(after.member, {
      ViewChannel: true,
    });

    const channelCode = Buffer.from(newChannel.id).toString('base64');

    const embed = new EmbedBuilder()
      .setColor(0x5d00ff)
      .setTitle('Private room created')
      .setDescription(
        `If you want someone to join this room, send them your channel code ***${channelCode}***`
      )
      .setTimestamp();

    await newChannel.send({
      embeds: [embed],
      content: `<@${after.member.id}>`,
    });
  }
}

export async function handleLobbyChannelDisconnect(before: VoiceState) {
  if (!before.channel?.parentId || !before.member) return;

  let lobby: Lobby;
  try {
    lobby = await api.getLobbyByLobbyId(before.guild.id, before.channel.parentId);
  } catch (e) {
    return;
  }

  if (before.channel.members.size > 0) return;

  if (before.channelId && lobby.protectedChannelIds.includes(before.channelId)) return;
  
  await before.channel.delete();
}