import {
  SlashCommandBuilder,
  CommandInteraction,
  ChannelType,
  EmbedBuilder,
  VoiceChannel,
  InteractionContextType,
  MessageFlags,
} from 'discord.js';
import { ApiError, ApiErrorType } from '../../errors/api';
import { Command } from '../../types';
import api from '../../utils/api';

const command: Command = {
  builder: new SlashCommandBuilder()
    .setName('set-personalized-naming')
    .setDescription(
      'Setups personalized naming scheme for the channels of selected lobby'
    )
    .addChannelOption((opt) => {
      opt.setName('channel');
      opt.setDescription('Channel for creation dynamic channels');
      opt.setRequired(true);
      opt.addChannelTypes(ChannelType.GuildVoice);

      return opt;
    })
    .addStringOption((opt) => {
      opt.setName('naming_scheme');
      opt.setDescription(
        "Channel naming scheme, {user} for username, {p_user} for username with 's, {c} for counter"
      );

      return opt;
    })
    .setContexts([InteractionContextType.Guild]),
  execute: async (interaction: CommandInteraction) => {
    const startTime = Date.now();
    if (!interaction.guildId) return;
    const channel = interaction.options.get('channel')?.channel;
    const namingScheme = interaction.options.get('naming_scheme')?.value as string | undefined;

    if (!(channel instanceof VoiceChannel)) {
      return;
    }

    let requiredRoleId: string;
    try {
      requiredRoleId = await api.getPersonalizedNamingPermissions(interaction.guildId)
        .then(res => res.roleId);
    } catch(e) {
      const embed = new EmbedBuilder()
        .setColor(0xff0000)
        .setTitle('An error occurred')
        .setDescription('An unknown error occurred, please try again later!')
        .setTimestamp();

      await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
      return;
    }

    if (requiredRoleId) {
      const member = await interaction.guild?.members.fetch(interaction.user.id);
      const roles = member?.roles.cache;

      if (!roles || !roles.find((role) => role.id === requiredRoleId)) {
        const embed = new EmbedBuilder()
          .setColor(0xff0000)
          .setTitle('Personalized naming scheme setup failed')
          .setDescription(
            `You don't have permission to set a personalized naming scheme!`
          )
          .setTimestamp();

        await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
        return;
      }
    }

    let apiCallTine = Date.now();
    try {
      await api.setPersonalizedNamingScheme(interaction.guildId, channel.id, interaction.user.id, namingScheme);
    } catch(e) {
      if (e instanceof ApiError) {
        let embed: EmbedBuilder;
        switch(e.type) {
          case ApiErrorType.LobbyNotFound:
            embed = new EmbedBuilder()
              .setColor(0xff0000)
              .setTitle('Personalized naming scheme setup failed')
              .setDescription(
                `The selected cahnnel is not an entrypoint channel for a lobby!`
              )
              .setTimestamp();
            break;
          case ApiErrorType.ForbiddenAction:
            embed = new EmbedBuilder()
              .setColor(0xff0000)
              .setTitle('Personalized naming scheme setup failed')
              .setDescription(
                `The selected lobby doesn't allow personalized naming schemes!`
              )
              .setTimestamp();
            break;
          default:
            embed = new EmbedBuilder()
              .setColor(0xff0000)
              .setTitle('An error occurred')
              .setDescription('An unknown error occurred, please try again later!')
              .setTimestamp();
            break;
        }

        await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
        return;
      } else {
        const embed = new EmbedBuilder()
          .setColor(0xff0000)
          .setTitle('An error occurred')
          .setDescription('An unknown error occurred, please try again later!')
          .setTimestamp();

        await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
        return;
      }
    }

    if (!namingScheme) {
      const embed = new EmbedBuilder()
        .setColor(0x5d00ff)
        .setTitle('Personalized naming scheme cleared')
        .setDescription(
          `Personalized naming scheme cleared for <#${channel.id}>`
        )
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
      return;
    }

    const embed = new EmbedBuilder()
      .setColor(0x5d00ff)
      .setTitle('Personalized naming scheme setup')
      .setDescription(
        `Personalized naming scheme updated for <#${channel.id}>`
      )
      .setTimestamp();

    const endTime = Date.now();

    await interaction.reply({ embeds: [embed] });
    return;
  },
};

export default command;
