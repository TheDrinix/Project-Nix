import {
  SlashCommandSubcommandBuilder,
  CommandInteraction,
  ChannelType,
  EmbedBuilder,
  VoiceChannel,
  MessageFlags,
} from 'discord.js';
import { ApiError, ApiErrorType } from 'src/errors/api';
import { Subcommand } from 'src/types';
import api from 'src/utils/api';

const command: Subcommand = {
  builder: new SlashCommandSubcommandBuilder()
    .setName('remove')
    .setDescription('Deletes a lobby')
    .addChannelOption((opt) => {
      opt.setName('channel');
      opt.setDescription('Lobby entrypoint channel');
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
        .setTitle('Dynamic lobby removal failed')
        .setDescription(`Please enter a valid voice channel`)
        .setTimestamp();

      await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
      return;
    }

    if (!channel.parentId || !channel.parent) {
      const embed = new EmbedBuilder()
        .setColor(0xff0000)
        .setTitle('Dynamic lobby removal failed')
        .setDescription(`Selected channel is not part of a lobby`)
        .setTimestamp();

      await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
      return;
    }

    try {
      await api.removeLobby(interaction.guildId, channel.id);
    } catch (e) {
      if (e instanceof ApiError && e.type === ApiErrorType.LobbyNotFound) {
        const embed = new EmbedBuilder()
          .setColor(0xff0000)
          .setTitle('Dynamic lobby removal failed')
          .setDescription(`Selected channel is not entrypoint of a lobby`)
          .setTimestamp();

        await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
      } else {
        const embed = new EmbedBuilder()
          .setColor(0xff0000)
          .setTitle('Dynamic lobby removal failed')
          .setDescription(`An unknown error occurred, please try again later`)
          .setTimestamp();

        await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
      }

      return;
    }

    const embed = new EmbedBuilder()
      .setColor(0x5d00ff)
      .setTitle('Dynamic channel lobby has been removed')
      .setDescription(
        `Dynamic channels will no longer get created when someone joins <#${channel.id}>`
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
  },
};

export default command;
