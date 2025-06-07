import { ActivityType, Client } from "discord.js";
import { type Event } from "../../types";

const event: Event = {
  name: 'setPresence',
  once: true,
  async execute(client: Client<true>) {
    console.log(`Bot is ready! Logged in as ${client.user.tag}`);
    client.user.setPresence({
      status: 'online',
      activities: [
        {
          name: "nix.drinix.xyz",
          type: ActivityType.Playing,
        },
      ],
    });
  },
};

export default event;
