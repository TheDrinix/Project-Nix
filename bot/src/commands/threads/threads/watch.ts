import {
  SlashCommandSubcommandBuilder,
  CommandInteraction,
  ChannelType,
  EmbedBuilder,
  PrivateThreadChannel,
  PublicThreadChannel,
  MessageFlags,
} from 'discord.js';
import { Subcommand } from 'src/types';
import api from 'src/utils/api';
import { type WatchThreadResponse } from 'src/types/api';

const command: Subcommand = {
  builder: new SlashCommandSubcommandBuilder()
    .setName('watch')
    .setDescription(
      'Watches/unwatches a thead to prevent archivation of the thread.'
    )
    .addChannelOption((opt) => {
      opt.setRequired(true);
      opt.addChannelTypes(ChannelType.PublicThread, ChannelType.PrivateThread);
      opt.setName('thread');
      opt.setDescription('Thread that needs to watched');

      return opt;
    }),
  execute: async (interaction: CommandInteraction) => {
    if (!interaction.guildId) return;

    const thread = interaction.options.get('thread')?.channel as
      | PublicThreadChannel
      | PrivateThreadChannel;

    if (!thread || !thread.parentId) {
      const embed = new EmbedBuilder()
        .setColor(0xff0000)
        .setTitle('Thread watcher setup failed')
        .setDescription('Select a valid thread!')
        .setTimestamp();

      await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
      return;
    }

    let res: WatchThreadResponse;
    try {
      res = await api.watchThread(interaction.guildId, thread.id, thread.parentId);
    } catch (e) {
      const embed = new EmbedBuilder()
        .setColor(0xff0000)
        .setTitle('Thread watcher setup failed')
        .setDescription('An unknown error occurred')
        .setTimestamp();

      await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
      return;
    }

    if (res.isWatched) {
      const embed = new EmbedBuilder()
        .setColor(0x5d00ff)
        .setTitle('Thread watched')
        .setDescription(
          'Thread is now being watched and prevented from being archived.'
        )
        .setTimestamp();

      await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
    } else {
      const embed = new EmbedBuilder()
        .setColor(0x5d00ff)
        .setTitle('Thread unwatched')
        .setDescription(
          'Thread is now longer being prevented from getting archived.'
        )
        .setTimestamp();

      await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
    }
  },
};

export default command;
