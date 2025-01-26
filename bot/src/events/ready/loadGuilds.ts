import { Guild } from "discord.js";
import { type Event } from "../../types";
import api from "../../utils/api";

const event: Event = {
  name: 'loadGuilds',
  once: true,
  async execute() {
    await api.loadGuilds();
  }
}

export default event;