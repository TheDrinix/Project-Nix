import { Guild } from "discord.js";
import { type Event } from "../../types";
import api from "../../utils/api";

const event: Event = {
  name: 'loadGuilds',
  once: true,
  async execute() {
    setTimeout(async () => {
      await api.loadGuilds();
    }, 5 * 60 * 1000);
  }
}

export default event;