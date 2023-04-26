import { Client, ClientOptions, Collection, MessageComponentInteraction } from "discord.js";
import { ComponentHandler, MessageCommand, SlashCommand, UserCommand } from "./index";

export class BotClient extends Client {
	constructor(options: ClientOptions) {
		super(options);
	}
	slashCommands: Collection<string, SlashCommand> = new Collection();
	userCommands: Collection<string, UserCommand> = new Collection();
	messageCommands: Collection<string, MessageCommand> = new Collection();
	componentHandlers: Collection<string, ComponentHandler<MessageComponentInteraction>> = new Collection();
}
