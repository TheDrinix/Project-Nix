import {
  SlashCommandSubcommandBuilder,
  CommandInteraction,
  EmbedBuilder,
  MessageFlags,
} from 'discord.js';
import { Subcommand } from '../../../types';
import api from '../../../utils/api';

const command: Subcommand = {
  builder: new SlashCommandSubcommandBuilder()
    .setName('list')
    .setDescription('Lists all watched thread in the server'),
  execute: async (interaction: CommandInteraction) => {
    if (!interaction.guildId) return;

    let threads = await api.getWatchedThreads(interaction.guildId);

    const embed = new EmbedBuilder()
      .setTitle('Watched threads')
      .setColor(0x5d00ff)
      .setTimestamp();

    if (threads.length) {
      let description = '';

      threads.forEach(
        (thread) =>
          (description += description ? `<#${thread.id}>` : `\n<#${thread.id}>`)
      );

      embed.setDescription(description);
    } else {
      embed.setDescription('There are currently no watched threads');
    }

    interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
  },
};

export default command;
