import { Events, Interaction } from "discord.js";
import { BotClient, Event } from "../structures";
import logger from "../logger";

export const event = new Event({
	type: Events.InteractionCreate,
	handler: async (i: Interaction & { client: BotClient }) => {
		console.time();
		logger.info(i);
		try {
			if (i.isChatInputCommand() || i.isAutocomplete()) {
				const command = i.client.slashCommands.get(i.commandName);
				if (!command) throw new Error("This command doesn't exist");

				if (i.isCommand()) await command.run(i);
				else if (i.isAutocomplete()) {
					if (!command.autocomplete) throw new Error("This command doesn't have an autocomplete response");
					await command.autocomplete(i);
				}
			} else if (i.isMessageComponent()) {
				const handler = i.client.handlers.get(i.customId.split(".")[0]);
				if (!handler) i.update({});
				else handler(i);
			}
		} catch (e) {
			logger.error(e);
			const error = { content: "An error occured, try again later\n" + `\`\`\`${e}\`\`\``, ephemeral: true };
			if (i.isRepliable()) i.replied ? i.followUp(error) : i.reply(error);
		} finally {
			logger.debug({ id: i.id, ttr: console.timeEnd() });
		}
	},
});
