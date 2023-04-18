import { SlashCommandBuilder, AutocompleteInteraction, ChatInputCommandInteraction } from "discord.js";
import { BotClient } from "./index";

/**
 * A slash command (chat-input application command) with a handler
 */
export class SlashCommand {
	constructor(options: {
		data: SlashCommandBuilder;
		run: (i: ChatInputCommandInteraction & { client: BotClient }) => any;
		autocomplete?: (i: AutocompleteInteraction & { client: BotClient }) => any;
	}) {
		this.data = options.data;
		this.run = options.run;
		if (options.autocomplete) this.autocomplete = options.autocomplete;
	}
	data: SlashCommandBuilder;
	run: (i: ChatInputCommandInteraction & { client: BotClient }) => any;
	autocomplete: (i: AutocompleteInteraction & { client: BotClient }) => any = (i: AutocompleteInteraction) => i.respond([]);
}
