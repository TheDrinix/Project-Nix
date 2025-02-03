import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  InteractionContextType,
} from 'discord.js';
import { Command } from 'src/types';

const command: Command = {
  builder: new SlashCommandBuilder()
    .setName('threads')
    .setDescription('Commands for managing thread watcher')
    .setContexts([InteractionContextType.Guild])
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
};

export default command;
