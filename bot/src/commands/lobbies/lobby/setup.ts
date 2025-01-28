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
import { CreateLobbyData } from 'src/types/api';
import api from 'src/utils/api';

const command: Subcommand = {
  builder: new SlashCommandSubcommandBuilder()
    .setName('setup')
    .setDescription(
      'Setups dynamic channel lobby (add waitroom to create private lobbies)',
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
        "Channel naming scheme, {user} for username, {p_user} for username with 's, {c} for counter",
      );
      opt.setRequired(true);
      opt.setMinLength(3);

      return opt;
    })
    .addChannelOption((opt) => {
      opt.setName('waitroom');
      opt.setDescription('Waitroom channel for joining private lobbies');
      opt.setRequired(false);
      opt.addChannelTypes(ChannelType.GuildVoice);

      return opt;
    })
    .addBooleanOption((opt) => {
      opt.setName('personalized_naming');
      opt.setDescription(
        'Allow personalized naming scheme for the lobby channels',
      );
      opt.setRequired(false);

      return opt;
    }),
  execute: async (interaction: CommandInteraction) => {
    if (!interaction.guildId) return;

    const channel = interaction.options.get('channel')?.channel;
    const waitroom = interaction.options.get('waitroom')?.channel;
    const namingScheme = interaction.options.get('naming_scheme')?.value;
    const allowPersonalizedNaming =
      (interaction.options.get('personalized_naming')?.value as
        | boolean
        | null) ?? false;

    if (!(channel instanceof VoiceChannel) || typeof namingScheme !== 'string') 
      return;
    
    if (!channel.parentId) {
      const embed = new EmbedBuilder()
        .setColor(0xff0000)
        .setTitle('Dynamic channel lobby setup failed')
        .setDescription(
          `Please enter a voice channel which is in a channel category!`,
        )
        .setTimestamp();

      await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
      return;
    }

    const protectedChannels = channel.parent?.children.cache.map((ch) =>
      ch.id,
    ) ?? [channel.id];

    const lobbyData: CreateLobbyData = {
      guildId: interaction.guildId,
      lobbyId: channel.parentId,
      entrypointId: channel.id,
      namingScheme,
      allowPersonalizedNaming,
      protectedChannelIds: protectedChannels,
    }

    if (waitroom instanceof VoiceChannel) {
      if (waitroom.parentId !== channel.parentId) {
        const embed = new EmbedBuilder()
          .setColor(0xff0000)
          .setTitle('Dynamic channel lobby setup failed')
          .setDescription(
            `Waitroom channel must be in same channel category as creation channel!`,
          )
          .setTimestamp();

        await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
        return;
      }

      lobbyData.waitingRoomId = waitroom.id;
    }

    try {
      await api.createLobby(lobbyData);
    } catch(e) {
      if (e instanceof ApiError && e.type === ApiErrorType.LobbyAlreadyExists) {
        const embed = new EmbedBuilder()
            .setColor(0xff0000)
            .setTitle('Dynamic channel lobby setup failed')
            .setDescription(
              `Lobby already exists in this channel category!`,
            )
            .setTimestamp();

          await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
          return;
      } else {
        console.error(e);
        const embed = new EmbedBuilder()
          .setColor(0xff0000)
          .setTitle('Dynamic channel lobby setup failed')
          .setDescription(
            `An unknown error occurred, please try again later!`,
          )
          .setTimestamp();

        await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
      }
    }

    const embed = new EmbedBuilder()
      .setColor(0x5d00ff)
      .setTitle('Dynamic channel lobby has been setup')
      .setDescription(
        `Dynamic channels will get created when someone joins <#${channel.id}>`,
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
  },
};

export default command;
