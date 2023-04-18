import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { SlashCommand } from "../structures";
import { createMessage } from "../messages/stats";

export const command = new SlashCommand({
	data: new SlashCommandBuilder().setName("stats").setDescription("Show bot stats.").setDMPermission(true),
	run: async (i: ChatInputCommandInteraction) => i.reply(createMessage(i)),
});
