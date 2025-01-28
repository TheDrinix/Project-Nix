import { Guild } from "discord.js";
import { getHttpInstance } from "./http";
import { CreateLobbyData, Lobby, ProtectChannelResponse } from "../types/api";
import { isAxiosError } from "axios";
import { ApiError, ApiErrorType } from "src/errors/api";

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

  async getGuildLobbies(guildId: string) {
    try {
      const res = await this._http.get<Lobby[]>(`/${guildId}/lobbies`);

      return res.data;
    } catch(e) {
      console.error(e);

      return [];
    }
  }

  async getLobbyByLobbyId(guildId: string, lobbyId: string) {
    try {
      const res = await this._http.get<Lobby>(`/${guildId}/lobbies/${lobbyId}`);

      return res.data;
    } catch(e) {
      if (isAxiosError(e)) {
        switch(e.status) {
          case 404:
            throw new ApiError(ApiErrorType.LobbyNotFound);
          default:
            console.error(e);
            throw new Error('An unknown error occurred');
        }
      } else {
        console.error(e);
        throw new Error('An unknown error occurred');
      }
    }
  }

  async getLobbyByEntryPointId(guildId: string, entryPointId: string) {
    try {
      const res = await this._http.get<Lobby>(`/${guildId}/lobbies/${entryPointId}?entrypoint`);

      return res.data;
    } catch(e) {
      if (isAxiosError(e)) {
        switch(e.status) {
          case 404:
            throw new ApiError(ApiErrorType.LobbyNotFound);
          default:
            console.error(e);
            throw new Error('An unknown error occurred');
        }
      } else {
        console.error(e);
        throw new Error('An unknown error occurred');
      }
    }
  }

  async createLobby(data: CreateLobbyData) {
    try {
      const res = await this._http.post<Lobby>(`/${data.guildId}/lobbies`, data);

      return res.data;
    } catch(e) {
      if (isAxiosError(e)) {
        switch(e.status) {
          case 400:
            throw new ApiError(ApiErrorType.InvalidRequestBody);
          case 404:
            throw new ApiError(ApiErrorType.GuildNotFound);
          case 409:
            throw new ApiError(ApiErrorType.LobbyAlreadyExists);
          default:
            console.error(e);
            throw new Error('An unknown error occurred');
        }
      } else {
        console.error(e);
        throw new Error('An unknown error occurred');
      }
    }
  }

  async protectChannel(guildId: string, lobbyId: string, channelId: string) {
    try {
      const res = await this._http.post<ProtectChannelResponse>(`/${guildId}/lobbies/${lobbyId}/protect`, { channelId });

      return res.data;
    } catch(e) {
      if (isAxiosError(e)) {
        switch(e.status) {
          case 400:
            throw new ApiError(ApiErrorType.InvalidRequestBody);
          case 403:
            throw new ApiError(ApiErrorType.CannotRemoveProtection);
          case 404:
            throw new ApiError(ApiErrorType.ChannelNotInLobby);
          default:
            console.error(e);
            throw new Error('An unknown error occurred');
        }
      } else {
        console.error(e);
        throw new Error('An unknown error occurred');
      }
    }
  }

  async removeLobby(guildId: string, entrypointId: string) {
    try {
      await this._http.delete(`/${guildId}/lobbies/${entrypointId}`);
    } catch(e) {
      if (isAxiosError(e)) {
        switch(e.status) {
          case 404:
            throw new ApiError(ApiErrorType.LobbyNotFound);
          default:
            console.error(e);
            throw new Error('An unknown error occurred');
        }
      } else {
        console.error(e);
        throw new Error('An unknown error occurred');
      }
    }
  }

  async setPersonalizedNamingPermissions(guildId: string, roleId: string) {
    try {
      await this._http.post(`/${guildId}/lobbies/personalizedNaming/permissions`, { roleId });
    } catch(e) {
      if (isAxiosError(e)) {
        switch(e.status) {
          case 400:
            throw new ApiError(ApiErrorType.InvalidRequestBody);
          case 404:
            throw new ApiError(ApiErrorType.GuildNotFound);
          default:
            console.error(e);
            throw new Error('An unknown error occurred');
        }
      } else {
        console.error(e);
        throw new Error('An unknown error occurred');
      }
    }
  }

  async getPersonalizedNamingPermissions(guildId: string) {
    try {
      const res = await this._http.get<{ roleId: string }>(`/${guildId}/lobbies/personalizedNaming/permissions`);

      return res.data;
    } catch(e) {
      if (isAxiosError(e)) {
        switch(e.status) {
          case 404:
            throw new ApiError(ApiErrorType.GuildNotFound);
          default:
            console.error(e);
            throw new Error('An unknown error occurred');
        }
      } else {
        console.error(e);
        throw new Error('An unknown error occurred');
      }
    }
  }

  async setPersonalizedNamingScheme(guildId: string, lobbyId: string, userId: string, pattern?: string) {
    try {
      await this._http.post(`/${guildId}/lobbies/${lobbyId}/personalizedNaming`, { userId, pattern });
    } catch(e) {
      if (isAxiosError(e)) {
        switch(e.status) {
          case 400:
            throw new ApiError(ApiErrorType.InvalidRequestBody);
          case 403: 
            throw new ApiError(ApiErrorType.ForbiddenAction);
          case 404:
            throw new ApiError(ApiErrorType.LobbyNotFound);
          default:
            console.error(e);
            throw new Error('An unknown error occurred');
        }
      } else {
        console.error(e);
        throw new Error('An unknown error occurred');
      }
    }
  }
}

const apiServiceSingleton = () => {
  return new ApiService();
}

const api = apiServiceSingleton();

export default api;