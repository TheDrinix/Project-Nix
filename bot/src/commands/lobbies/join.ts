import {
  SlashCommandBuilder,
  CommandInteraction,
  EmbedBuilder,
  VoiceChannel,
  InteractionContextType,
  MessageFlags,
} from 'discord.js';
import { ApiError, ApiErrorType } from 'src/errors/api';
import { Command } from 'src/types';
import { Lobby } from 'src/types/api';
import api from 'src/utils/api';

const command: Command = {
  builder: new SlashCommandBuilder()
    .setName('join')
    .setDescription(
      'Used to join a private lobby channel (You have to be inside of the lobbies waitroom!)'
    )
    .addStringOption((opt) => {
      opt.setRequired(true);
      opt.setName('channel-code');
      opt.setDescription('Enter a lobby private channel code');

      return opt;
    })
    .setContexts([InteractionContextType.BotDM, InteractionContextType.Guild])
    .setDefaultMemberPermissions(0),
  execute: async (interaction: CommandInteraction) => {
    const channelCode = interaction.options.get('channel-code')
      ?.value as string;

    const channelId = Buffer.from(channelCode, 'base64').toString('utf-8');

    const channel = await interaction.client.channels.fetch(channelId);

    if (!(channel instanceof VoiceChannel) || !channel.parentId) {
      const embed = new EmbedBuilder()
        .setColor(0xff0000)
        .setTitle('Unable to join lobby private channel')
        .setDescription(`Enter a valid channel code!`)
        .setTimestamp();

      await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
      return;
    }

    const member = await channel.guild.members.fetch(interaction.user.id);

    let lobby: Lobby;
    try {
      lobby = await api.getLobbyByLobbyId(channel.guild.id, channel.parentId);
    } catch (e: any) {
      if (e instanceof ApiError && e.type === ApiErrorType.LobbyNotFound) {
        const embed = new EmbedBuilder()
          .setColor(0xff0000)
          .setTitle('Unable to join lobby private channel')
          .setDescription(`Enter a valid channel code!`)
          .setTimestamp();

        await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
        return;
      }

      const embed = new EmbedBuilder()
        .setColor(0xff0000)
        .setTitle('Unable to join lobby private channel')
        .setDescription(`An unknown error occurred, please try again later!`)
        .setTimestamp();

      await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
      return;
    }

    if (!member.voice.channelId || member.voice.channel?.guildId !== channel.guild.id) {
      const embed = new EmbedBuilder()
        .setColor(0xff0000)
        .setTitle('Unable to join lobby private channel')
        .setDescription(`You have to be in a voice room within the same guild as the channel you're trying to join!`)
        .setTimestamp();

      await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
      return;
    }

    channel.permissionOverwrites.edit(member, { ViewChannel: true });

    member.voice.setChannel(channel);

    const embed = new EmbedBuilder()
      .setColor(0x5d00ff)
      .setTitle('Joined private room')
      .setDescription(`You've been joined to <#${channel.id}>`)
      .setTimestamp();

    await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
  },
};

export default command;
