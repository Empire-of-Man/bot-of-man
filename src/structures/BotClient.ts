import { Client, ClientOptions, Collection, MessageComponentInteraction } from "discord.js";
import { SlashCommand } from "./SlashCommand";

/**
 * The main bot client with additional properties
 */
export class BotClient extends Client {
	constructor(options: ClientOptions) {
		super(options);
	}
	slashCommands: Collection<string, SlashCommand> = new Collection();
	handlers: Collection<string, ((i: MessageComponentInteraction) => any) | undefined> = new Collection();
}
