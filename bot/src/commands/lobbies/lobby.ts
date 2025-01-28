import { PermissionFlagsBits, SlashCommandBuilder, InteractionContextType } from 'discord.js';
import { Command } from '../../types';

const command: Command = {
  builder: new SlashCommandBuilder()
    .setName('lobby')
    .setDescription('Commands for managing lobbies')
    .setContexts([InteractionContextType.Guild])
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
};

export default command;
