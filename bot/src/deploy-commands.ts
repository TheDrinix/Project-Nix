import {
  Collection,
  REST,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
  Routes,
} from 'discord.js';
import { Command } from './types';
import { loadCommands } from './utils/loaders';

require('dotenv').config();

type Cmd = RESTPostAPIChatInputApplicationCommandsJSONBody;

async function getCommands() {
  let loadedCommands: Cmd[] = [];
  let loadedGuildCommands: Map<string, Cmd[]> = new Map();

  console.log('[INFO] Loading commands');

  const commands = new Collection<string, Command>();

  await loadCommands(commands);

  for (let command of commands.values()) {
    if (command.guilds) {
      for (let guild of command.guilds) {
        if (!loadedGuildCommands.has(guild)) {
          console.log(
            `Loaded command ${command.builder.name} for guild with id ${guild}`
          );
          loadedGuildCommands.set(guild, [command.builder.toJSON()]);
        } else {
          const loaded = loadedGuildCommands.get(guild) as Cmd[];

          loaded.push(command.builder.toJSON());

          loadedGuildCommands.set(guild, loaded);
        }
      }
    } else {
      loadedCommands.push(command.builder.toJSON());
    }
  }

  console.log('[INFO] Finished loading commands');

  return {
    app: loadedCommands,
    guild: loadedGuildCommands,
  };
}

async function deployCommands() {
  const token = process.env['BOT_TOKEN'];
  const clientId = process.env['CLIENT_ID'];

  const commands = await getCommands();

  const appCommands = commands?.app;
  const guildCommands = commands?.guild;

  if (!appCommands?.length && !guildCommands?.size) {
    console.error('[ERROR] No commands found');
    return;
  }

  if (!token || !clientId) {
    console.error('[ERROR] Missing token or client id');
    return;
  }

  // Construct and prepare an instance of the REST module
  const rest = new REST().setToken(token);

  try {
    if (appCommands.length) {
      console.log(
        `[INFO] Started deploying ${appCommands.length} application (/) commands`
      );

      const appData: any = await rest.put(
        Routes.applicationCommands(clientId),
        {
          body: appCommands,
        }
      );

      console.log(
        `[INFO] Successfully deployed ${appData.length} application (/) commands`
      );
    }

    if (guildCommands.size) {
      for (let [guildId, gCommands] of guildCommands) {
        if (!gCommands.length) continue;

        console.log(
          `[INFO] Started deploying ${gCommands.length} guild (/) commands for guild with id ${guildId}`
        );

        const guildData: any = await rest.put(
          Routes.applicationGuildCommands(clientId, guildId),
          {
            body: gCommands,
          }
        );

        console.log(
          `[INFO] Successfully deployed ${guildData.length} application (/) commands for guild with id ${guildId}`
        );
      }
    }
  } catch (error) {
    console.error(`[ERROR] ${error}`);
  }
}

deployCommands();
