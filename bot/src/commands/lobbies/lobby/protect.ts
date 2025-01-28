import {
  ChannelType,
  CommandInteraction,
  EmbedBuilder,
  SlashCommandSubcommandBuilder,
  VoiceChannel,
} from 'discord.js';
import { ApiError, ApiErrorType } from 'src/errors/api';
import { Subcommand } from 'src/types';
import { ProtectChannelResponse } from 'src/types/api';
import api from 'src/utils/api';

const command: Subcommand = {
  builder: new SlashCommandSubcommandBuilder()
    .setName('protect')
    .setDescription(
      'Adds/removes a channel from list of protected channels in lobby'
    )
    .addChannelOption((opt) => {
      opt.setName('channel');
      opt.setDescription('Protected channel');
      opt.addChannelTypes(ChannelType.GuildVoice);
      opt.setRequired(true);

      return opt;
    }),
  execute: async (interaction: CommandInteraction) => {
    if (!interaction.guildId) return;
    const channel = interaction.options.get('channel')?.channel;

    if (!(channel instanceof VoiceChannel)) {
      const embed = new EmbedBuilder()
        .setColor(0xff0000)
        .setTitle('Channel protection update failed')
        .setDescription(`Please enter a valid voice channel`)
        .setTimestamp();

      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    if (!channel.parentId || !channel.parent) {
      const embed = new EmbedBuilder()
        .setColor(0xff0000)
        .setTitle('Channel protection update failed')
        .setDescription(`Channel is not part of a lobby channel category.`)
        .setTimestamp();

      await interaction.reply({ embeds: [embed], ephemeral: true });
      return;
    }

    let res: ProtectChannelResponse;
    try {
      res = await api.protectChannel(interaction.guildId, channel.parentId, channel.id);
    } catch(e) {
      if (e instanceof ApiError && e.type !== ApiErrorType.InvalidRequestBody) {
        const embed = new EmbedBuilder()
          .setColor(0xff0000)
          .setTitle('Channel protection update failed')
          .setDescription(e.message)
          .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: true });
      } else {
        const embed = new EmbedBuilder()
          .setColor(0xff0000)
          .setTitle('Channel protection update failed')
          .setDescription(`An unknown error occurred, please try again later.`)
          .setTimestamp();

        await interaction.reply({ embeds: [embed], ephemeral: true });
      }

      return;
    }

    if (res.isProtected) {
      const embed = new EmbedBuilder()
        .setColor(0x5d00ff)
        .setTitle('Channel has been added to lobby protection list')
        .setDescription(
          `<#${channel.id}> has been added to the list of protected channels for lobby <#${res.lobby.entryPointId}>`
        )
        .setTimestamp();

      await interaction.reply({ embeds: [embed], ephemeral: true });
    } else {
      const embed = new EmbedBuilder()
        .setColor(0x5d00ff)
        .setTitle('Channel has been removed from lobby protection list')
        .setDescription(
          `<#${channel.id}> has been removed from the list of protected channels for lobby <#${res.lobby.entryPointId}>`
        )
        .setTimestamp();

      await interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};

export default command;
