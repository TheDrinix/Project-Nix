import { Events, ThreadChannel } from 'discord.js';
import { Event } from 'src/types';
import { WatchedThread } from 'src/types/api';
import api from 'src/utils/api';

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
