import {
  APIEmbedField,
  CommandInteraction,
  EmbedBuilder,
  SlashCommandSubcommandBuilder,
} from 'discord.js';
import { type Subcommand } from 'src/types';
import api from 'src/utils/api';

const command: Subcommand = {
  builder: new SlashCommandSubcommandBuilder()
    .setName('list')
    .setDescription('Lists all active lobbies in current server'),
  execute: async (interaction: CommandInteraction) => {
    if (!interaction.guildId) return;

    const lobbies = await api.getGuildLobbies(interaction.guildId);

    if (!lobbies.length) {
      const embed = new EmbedBuilder()
        .setColor(0x5d00ff)
        .setTitle('Dynamic channel lobbies')
        .setDescription(`There are currently no lobbies setup`)
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
      return;
    }

    const fields: APIEmbedField[] = [];

    for (let lobby of lobbies) {
      fields.push({
        name: `${lobby.isPrivate ? 'Private' : 'Public'} lobby in <#${
          lobby.entryPointId
        }>`,
        value: `${
          lobby.isPrivate ? 'Waitroom: <#' + lobby.waitingRoomId?.toString() + '>\n' : ''
        }Naming scheme: ${lobby.namingScheme}
                Allows personalized naming schemes: ${
                  lobby.allowPersonalizedNaming
                }`,
      });
    }

    const embed = new EmbedBuilder()
      .setColor(0x5d00ff)
      .setTitle('Dynamic channel lobbies')
      .addFields(fields)
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};

export default command;
