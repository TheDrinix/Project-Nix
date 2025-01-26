import { Client, Collection, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';
import { Command } from './types';
import { loadCommands, loadEvents } from './utils/loaders';

dotenv.config();

declare module 'discord.js' {
  interface Client {
    commands: Collection<string, Command>;
  }
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
  ]
});

client.commands = new Collection();

loadCommands(client.commands);
loadEvents(client);

client.login(process.env.BOT_TOKEN)
  .then(() => console.log('Bot is online!'))
  .catch(console.error);