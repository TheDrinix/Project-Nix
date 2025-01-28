import {
  ClientEvents,
  Collection,
  Events,
  SlashCommandBuilder,
  SlashCommandOptionsOnlyBuilder,
  SlashCommandSubcommandBuilder,
  SlashCommandSubcommandGroupBuilder,
} from 'discord.js';

export interface Module<T> {
  default: T;
}

export type execFunc = (...args: any[]) => Promise<void>;
export type Command = ExecutableCommand | ParentCommand;

interface Cmd {
  builder: SlashCommandBuilder;
  guilds?: string[];
}

interface ExecutableCommand extends Cmd {
  builder: SlashCommandOptionsOnlyBuilder;
  execute: execFunc;
}

interface ParentCommand extends Cmd {
  subcommands?: Collection<string, Subcommand | SubcommandGroup>;
}

export interface Subcommand {
  builder: SlashCommandSubcommandBuilder;
  execute: execFunc;
}

export interface SubcommandGroup {
  builder: SlashCommandSubcommandGroupBuilder;
  subcommands: Collection<string, Subcommand>;
}

export interface Event {
  name?: string;
  once?: boolean;
  execute: execFunc;
}