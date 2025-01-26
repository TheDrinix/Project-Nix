import { Guild } from 'discord.js';
import { type Event } from '../../types';
import api from '../../utils/api';

const event: Event = {
  name: 'leaveGuild',
  once: false,
  async execute(guild: Guild) {
    await api.removeGuild(guild);
  },
};

export default event;