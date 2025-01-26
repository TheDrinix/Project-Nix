import { Guild } from "discord.js";
import { type Event } from "../../types";
import api from "../../utils/api";

const event: Event = {
  name: 'joinGuild',
  once: false,
  async execute(guild: Guild) {
    await api.storeGuild(guild);
  }
}

export default event;