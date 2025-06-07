import {
  SlashCommandSubcommandBuilder,
  CommandInteraction,
  EmbedBuilder,
  PermissionFlagsBits,
  Role,
  MessageFlags,
} from 'discord.js';
import { Subcommand } from '../../../types';
import api from '../../../utils/api';

const command: Subcommand = {
  builder: new SlashCommandSubcommandBuilder()
    .setName('set-naming-permissions')
    .setDescription('Sets required role for personalized naming scheme')
    .addRoleOption((opt) => {
      opt.setName('role');
      opt.setDescription('Role required for personalized naming scheme');
      opt.setRequired(true);

      return opt;
    }),
  execute: async (interaction: CommandInteraction) => {
    if (!interaction.guildId) {
      return;
    }
    const role = interaction.options.get('role')?.role;

    if (!(role instanceof Role)) {
      return;
    }

    try {
      await api.setPersonalizedNamingPermissions(interaction.guildId, role.id);
    } catch (e) {
      const embed = new EmbedBuilder()
        .setColor(0xff0000)
        .setTitle('An error occurred')
        .setDescription('An unknown error occurred, please try again later!') 
        .setTimestamp();

      await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
      return;
    }

    const embed = new EmbedBuilder()
      .setColor(0x5d00ff)
      .setTitle('Personalized naming scheme permissions updated')
      .setDescription(
        `Personalized naming scheme permissions updated to ${role}`
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
  },
};

export default command;
