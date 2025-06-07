import { ThreadChannel } from 'discord.js';
import { Event } from '../../types';
import api from '../../utils/api';

const event: Event = {
  name: 'removeWatchedThread',
  once: false,
  async execute(thread: ThreadChannel) {
    if (thread.archived) return;

    await api.removeWatchedThread(thread.guildId, thread.id);
  },
};

export default event;
