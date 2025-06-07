import { VoiceState } from 'discord.js';
import { createLobbyChannel, handleLobbyChannelDisconnect } from '../../utils/lobby';
import { Event } from '../../types';

const event: Event = {
  name: 'lobbyHandler',
  once: false,
  async execute(before: VoiceState, after: VoiceState) {
    // Connected voice channel
    if (!before.channel && after.channel) {
      createLobbyChannel(after);
    }
    // Disonnected from voice channel
    else if (!after.channel && before.channel) {
      handleLobbyChannelDisconnect(before);
    } else if (after.channel && before.channel) {
      // Channel switched
      if (before.channelId !== after.channelId) {
        createLobbyChannel(after);
        handleLobbyChannelDisconnect(before);
      }
    }
  },
};

export default event;
