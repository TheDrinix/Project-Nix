import { Guild } from "discord.js";
import { getHttpInstance } from "./http";

class ApiService {
  private _http: ReturnType<typeof getHttpInstance>;
  constructor() {
    this._http = getHttpInstance();
  }

  async storeGuild(guild: Guild) {
    const body = {
      guildId: guild.id,
      name: guild.name,
    };

    return this._http.post('/guilds', body);
  }

  async removeGuild(guild: Guild) {
    return this._http.delete(`/guilds/${guild.id}`);
  }

  async loadGuilds() {
    return this._http.post('/guilds/load');
  }
}

const apiServiceSingleton = () => {
  return new ApiService();
}

const api = apiServiceSingleton();

export default api;