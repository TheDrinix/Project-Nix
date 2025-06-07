import { Events, ThreadChannel } from 'discord.js';
import { Event } from '../../types';
import { WatchedThread } from '../../types/api';
import api from '../../utils/api';

const event: Event = {
  name: 'unarchiveWatchedThread',
  once: false,
  async execute(before: ThreadChannel, after: ThreadChannel) {
    if (before.archived || !after.archived) return;

    let watchedThread: WatchedThread;
    try {
      watchedThread = await api.getWatchedThread(after.guildId, after.id);
    } catch (e) {
      console.error(e);
      return;
    }

    await after.setArchived(false);
  },
};

export default event;
