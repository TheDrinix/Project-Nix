import { GuildMember } from 'discord.js';
import { type Event } from '../../types';
import {  handleAnnouncementMessage } from '../../utils/announcements';

const event: Event = {
  name: 'announceMemberJoin',
  once: false,
  async execute(member: GuildMember) {
    handleAnnouncementMessage('join', member.guild, member.user);
  },
};

export default event;
