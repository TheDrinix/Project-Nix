import { CacheType, Events, Interaction } from 'discord.js';
import {
  Command,
  Event,
  SubcommandGroup,
  Subcommand,
} from '../../types';

const event: Event = {
  name: Events.InteractionCreate,
  once: false,
  async execute(interaction: Interaction<CacheType>) {
    if (!interaction.isChatInputCommand()) return;

    const command: Command | undefined = interaction.client.commands.get(
      interaction.commandName
    );

    if (!command) {
      console.error(
        `No command matching ${interaction.commandName} was found.`
      );
      return;
    }

    try {
      if ('execute' in command) {
        await command.execute(interaction);
      } else {
        const subcommandGroup = interaction.options.getSubcommandGroup(false);
        const subcommandName = interaction.options.getSubcommand(false);

        if (subcommandGroup && subcommandName) {
          const group = command.subcommands?.get(
            subcommandGroup
          ) as SubcommandGroup;

          if (!group) {
            console.error(
              `No subcommand group matching ${subcommandGroup} was found.`
            );
            return;
          }

          const subcommand = group.subcommands?.get(subcommandName);

          if (!subcommand) {
            console.error(
              `No subcommand matching ${subcommandName} for ${subcommandGroup} group was found.`
            );
            return;
          }

          await subcommand.execute(interaction);
        } else if (subcommandName) {
          const subcommand = command.subcommands?.get(
            subcommandName
          ) as Subcommand;

          if (!subcommand) {
            console.error(
              `No subcommand matching ${subcommandName} was found.`
            );
            return;
          }

          await subcommand.execute(interaction);
        } else {
          console.error(
            `No subcommand name was provided for ${interaction.commandName}.`
          );
        }
      }
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({
          content: 'There was an error while executing this command!',
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: 'There was an error while executing this command!',
          ephemeral: true,
        });
      }
    }
  },
};

export default event;
