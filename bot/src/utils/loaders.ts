import { Client, Collection, Events } from 'discord.js';
import path from 'path';
import fs from 'node:fs';
import {
  Module,
  Event,
  execFunc,
  Command,
  SubcommandGroup,
  Subcommand,
} from '../types';

export async function loadCommands(commands: Collection<string, Command>) {
  const foldersPath = path.join(__dirname, 'commands');
  const commandFolders = fs.readdirSync(foldersPath);

  for (let folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs
      .readdirSync(commandsPath)
      .filter((file) => file.endsWith('.js') || file.endsWith('.ts'));

    for (let file of commandFiles) {
      const filePath = path.join(commandsPath, file);
      const module = (await import(filePath)) as Module<Command>;

      const command = module.default;

      if ('execute' in command || 'subcommands' in command) {
        commands.set(command.builder.name, command);
      } else {
        const filename = path.basename(filePath, path.extname(filePath));

        if (fs.existsSync(path.join(commandsPath, filename))) {
          await loadSubcommands(path.join(commandsPath, filename), true).then(
            (subcommands) => {
              command.subcommands = subcommands;

              for (let subcommand of subcommands.values()) {
                if ('execute' in subcommand) {
                  command.builder.addSubcommand(subcommand.builder);
                } else {
                  command.builder.addSubcommandGroup(subcommand.builder);
                }
              }

              commands.set(command.builder.name, command);
            }
          );
        } else {
          console.warn(
            `The command at ${filePath} is missing a required "execute" function or any defined subcommands.`
          );
        }
      }
    }
  }
}
async function loadSubcommands(
  subPath: string,
  allowGroups: true
): Promise<Collection<string, Subcommand | SubcommandGroup>>;
async function loadSubcommands(
  subPath: string,
  allowGroups: false
): Promise<Collection<string, Subcommand>>;
async function loadSubcommands(subPath: string, allowGroups: boolean) {
  const subcommands: Subcommand[] = [];
  const SubcommandGroups: SubcommandGroup[] = [];

  const subcommandFiles = fs.readdirSync(subPath, { withFileTypes: true });

  const subFolders = subcommandFiles
    .filter((f) => f.isDirectory())
    .map((f) => f.name);

  const subFiles = subcommandFiles.filter((f) => f.isFile()).map((f) => f.name);

  for (let file of subFiles) {
    const filePath = path.join(subPath, file);
    const module = (await import(filePath)) as Module<
      Subcommand | SubcommandGroup
    >;

    const subcommand = module.default;

    if ('execute' in subcommand) {
      subcommands.push(subcommand);
    } else {
      const filename = path.basename(file, path.extname(file));

      if (allowGroups && subFolders.includes(filename)) {
        const groupSubcommands: Collection<string, Subcommand> =
          await loadSubcommands(path.join(subPath, filename), false);

        subcommand.subcommands = groupSubcommands;

        for (let groupSubcommand of groupSubcommands.values()) {
          subcommand.builder.addSubcommand(groupSubcommand.builder);
        }

        SubcommandGroups.push(subcommand);
      } else {
        console.warn(
          `The subcommand at ${filePath} is missing a required "execute" function or any defined subcommands.`
        );
      }
    }
  }

  if (allowGroups) {
    const subcommandCollection = new Collection<
      string,
      Subcommand | SubcommandGroup
    >();

    for (let subcommand of subcommands) {
      subcommandCollection.set(subcommand.builder.name, subcommand);
    }

    for (let group of SubcommandGroups) {
      subcommandCollection.set(group.builder.name, group);
    }

    return subcommandCollection;
  } else {
    const subcommandCollection = new Collection<string, Subcommand>();

    for (let subcommand of subcommands) {
      subcommandCollection.set(subcommand.builder.name, subcommand);
    }

    return subcommandCollection;
  }
}

export async function loadEvents(client: Client) {
  const validEvents: string[] = Object.values(Events).filter(
    (val) => typeof val === 'string'
  );

  const eventsPath = path.join(__dirname, 'events');
  const eventDirs = fs
    .readdirSync(eventsPath, { withFileTypes: true })
    .filter((f) => f.isDirectory())
    .map((dir) => dir.name)
    .filter((dir) => validEvents.includes(dir));

  for (let dir of eventDirs) {
    const eventOnActions: execFunc[] = [];
    const eventOnceActions: execFunc[] = [];
    const eventPath = path.join(eventsPath, dir);

    const eventActions = fs
      .readdirSync(eventPath)
      .filter((file) => file.endsWith('.js') || file.endsWith('.ts'));

    console.log(`Registering ${eventActions.length} actions for ${dir} event`);

    const paths = eventActions.map((file) => path.join(eventPath, file));

    for (let path of paths) {
      const module = (await import(path)) as Module<Event>;
      const event = module.default;

      if (event.once) {
        eventOnceActions.push(event.execute);
      } else {
        eventOnActions.push(event.execute);
      }
    }

    if (eventOnceActions.length)
      client.once(dir, (...args) =>
        Promise.all(eventOnceActions.map((fn) => fn(...args))).then()
      );

    if (eventOnActions.length)
      client.on(dir, (...args) =>
        Promise.all(eventOnActions.map((fn) => fn(...args))).then()
      );
  }
}
