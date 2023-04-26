import { Events, Interaction, InteractionResponse, InteractionType } from "discord.js";
import { BotClient, Event } from "../structures";
import logger from "../logger";

export const event = new Event({
	type: Events.InteractionCreate,
	handler: async (i: Interaction & { client: BotClient }) => {
		console.time("ttr");

		logger.info({
			interaction: {
				type: InteractionType[i.type],
				id: i.id,
				guild: i.guildId,
				channel: i.channelId,
				user: i.user.id,
				customId: "customId" in i ? i.customId : undefined,
				message: "message" in i ? i.message?.id : undefined,
				command: "commandId" in i && "commandName" in i ? { id: i.commandId, name: i.commandName } : undefined,
			},
		});

		setTimeout(() => {
			if (i.isRepliable() && !(i.deferred || i.replied)) {
				console.timeEnd("ttr");
				logger.error(`Interaction (${i.id}) timed out without a response`);
			}
		}, 2900);

		let response: InteractionResponse | undefined = undefined;
		try {
			if (i.isCommand()) {
				if (i.isChatInputCommand()) {
					const command = i.client.slashCommands.get(i.commandName);
					if (!command) throw new Error("This command doesn't exist");
					else response = await command.run(i);
				}

				if (i.isUserContextMenuCommand()) {
					const command = i.client.userCommands.get(i.commandName);
					if (!command) throw new Error("This command doesn't exist");
					else response = await command.run(i);
				}

				if (i.isMessageContextMenuCommand()) {
					const command = i.client.messageCommands.get(i.commandName);
					if (!command) throw new Error("This command doesn't exist");
					else response = await command.run(i);
				}
			} else if (i.isAutocomplete()) {
				const command = i.client.slashCommands.get(i.commandName);
				if (!command) throw new Error("This command doesn't exist");
				command.autocomplete(i);
			} else if (i.isMessageComponent()) {
				const handler = i.client.componentHandlers.get(i.customId.split(".")[0]);
				if (!handler) i.update({});
				else response = await handler(i);
			}
		} catch (e) {
			logger.error({ message: e, ttr: console.timeEnd("ttr") });
			const error = { content: "An error occured, try again later\n" + `\`\`\`${e}\`\`\``, ephemeral: true };
			if (i.isRepliable()) i.replied ? i.followUp(error) : i.reply(error);
		}
		logger.debug({ response: response ?? null, ttr: console.timeEnd("ttr") });
	},
});
