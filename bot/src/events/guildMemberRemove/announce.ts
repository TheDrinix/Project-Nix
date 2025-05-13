import { AuditLogEvent, GuildMember } from 'discord.js';
import { type Event } from '../../types';
import { handleAnnouncementMessage } from '../../utils/announcements';

const event: Event = {
  name: 'announceMemberLeave',
  once: false,
  async execute(member: GuildMember) {
    const banAuditLogs = await member.guild.fetchAuditLogs({
      limit: 1,
      type: AuditLogEvent.MemberBanAdd
    });

    const auditEntry = banAuditLogs.entries.first();

    if (auditEntry?.targetId === member.id && auditEntry.createdAt > (member.joinedAt ?? new Date(0))) {
      await handleAnnouncementMessage('ban', member.guild, member.user);
    } else {
      await handleAnnouncementMessage('leave', member.guild, member.user)
    }
  },
};

export default event;
