import { ThreadChannel } from 'discord.js';
import { Event } from 'src/types';
import api from 'src/utils/api';

const event: Event = {
  name: 'removeWatchedThread',
  once: false,
  async execute(thread: ThreadChannel) {
    if (thread.archived) return;

    await api.removeWatchedThread(thread.guildId, thread.id);
  },
};

export default event;
