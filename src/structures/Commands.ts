import {
	AutocompleteInteraction,
	ChatInputCommandInteraction,
	UserContextMenuCommandInteraction,
	RESTPostAPIContextMenuApplicationCommandsJSONBody,
	MessageContextMenuCommandInteraction,
	RESTPostAPIChatInputApplicationCommandsJSONBody,
	ApplicationCommandType,
	InteractionResponse,
	CommandInteraction,
} from "discord.js";
import { BotClient } from "./index";

type CommandHandler<InteractionType extends CommandInteraction> = (i: InteractionType & { client: BotClient }) => Promise<InteractionResponse<boolean>>;
type AutocompleteHandler = (i: AutocompleteInteraction & { client: BotClient }) => void;

export class SlashCommand {
	constructor(options: {
		data: Omit<RESTPostAPIChatInputApplicationCommandsJSONBody, "type">;
		run: CommandHandler<ChatInputCommandInteraction>;
		autocomplete?: AutocompleteHandler;
	}) {
		this.data = { ...options.data, type: ApplicationCommandType.ChatInput };
		this.run = options.run;
		if (options.autocomplete) this.autocomplete = options.autocomplete;
	}
	data: RESTPostAPIChatInputApplicationCommandsJSONBody;
	run: CommandHandler<ChatInputCommandInteraction>;
	autocomplete: AutocompleteHandler = async (i: AutocompleteInteraction) => await i.respond([]);
}

export class UserCommand {
	constructor(options: {
		data: Omit<RESTPostAPIContextMenuApplicationCommandsJSONBody, "type" | "options">;
		run: CommandHandler<UserContextMenuCommandInteraction>;
	}) {
		this.data = { ...options.data, type: ApplicationCommandType.User };
		this.run = options.run;
	}
	data: RESTPostAPIContextMenuApplicationCommandsJSONBody;
	run: CommandHandler<UserContextMenuCommandInteraction>;
}

export class MessageCommand {
	constructor(options: {
		data: Omit<RESTPostAPIContextMenuApplicationCommandsJSONBody, "type" | "options">;
		run: CommandHandler<MessageContextMenuCommandInteraction>;
	}) {
		this.data = { ...options.data, type: ApplicationCommandType.Message };
		this.run = options.run;
	}
	data: RESTPostAPIContextMenuApplicationCommandsJSONBody;
	run: CommandHandler<MessageContextMenuCommandInteraction>;
}
