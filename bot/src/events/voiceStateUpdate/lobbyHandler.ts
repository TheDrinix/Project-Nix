import { VoiceState } from 'discord.js';
import { createLobbyChannel, handleLobbyChannelDisconnect } from '../../utils/lobby';
import { Event } from '../../types';

const event: Event = {
  name: 'lobbyHandler',
  once: false,
  async execute(before: VoiceState, after: VoiceState) {
    // Connected voice channel
    if (!before.channel && after.channel) {
      await createLobbyChannel(after);
    }
    // Disonnected from voice channel
    else if (!after.channel && before.channel) {
      await handleLobbyChannelDisconnect(before);
    } else if (after.channel && before.channel) {
      // Channel switched
      if (before.channelId !== after.channelId) {
        await createLobbyChannel(after);
        await handleLobbyChannelDisconnect(before);
      }
    }
  },
};

export default event;
