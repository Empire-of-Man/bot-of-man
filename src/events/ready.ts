import { Events } from "discord.js";
import { BotClient, Event } from "../structures";
import logger from "../logger";

export const event = new Event({
	type: Events.ClientReady,
	handler: async (c: BotClient) => logger.info(`Logged in as ${c.user?.tag}`),
	once: true,
});
