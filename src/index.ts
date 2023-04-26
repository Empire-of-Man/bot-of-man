import { ActivityType, GatewayIntentBits, REST, Routes } from "discord.js";
import { BotClient, Event, MessageCommand, SlashCommand, UserCommand } from "./structures";
import { readdirSyncRecursive } from "./utils";
import { cleanEnv, str } from "envalid";
import { DISCORD_CLIENT_ID, DISCORD_TESTING_GUILD_ID, SHOULD_UPDATE_COMMANDS } from "./config";
import logger from "./logger";
import path from "node:path";
import dotenv from "dotenv";
dotenv.config();

// 0. Validate the environment
export const env = cleanEnv(process.env, {
	DISCORD_TOKEN: str(),
	DISCORD_CLIENT_SECRET: str(),
	API_KEY: str(),
	NODE_ENV: str({ choices: ["development", "test", "production", "staging"] }),
});

// 1. Create the client
const client = new BotClient({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
	presence: { activities: [{ type: ActivityType.Watching, name: "the Empire grow" }] },
});

// 2. Initialize events
readdirSyncRecursive(path.join(__dirname, "events"), ".js").forEach(async (cmdPath) => {
	const event: Event = (await import(cmdPath)).event;
	if (event.once) client.once(event.type, event.handler);
	else client.on(event.type, event.handler);
});

// 3. Initialize commands
(async () => {
	// 3.1. Load commands to the client
	const commands = await Promise.all(readdirSyncRecursive(path.join(__dirname, "commands"), ".js").map(async (cmdPath) => (await import(cmdPath)).command));
	commands.forEach((cmd) => {
		if (cmd instanceof SlashCommand) client.slashCommands.set(cmd.data.name, cmd);
		else if (cmd instanceof UserCommand) client.userCommands.set(cmd.data.name, cmd);
		else if (cmd instanceof MessageCommand) client.messageCommands.set(cmd.data.name, cmd);
	});

	// 3.2. Update commands (if needed)
	if (SHOULD_UPDATE_COMMANDS) {
		const rest = new REST({ version: "10" }).setToken(env.DISCORD_TOKEN);
		const body = commands.filter((cmd) => cmd).map((cmd) => cmd.data);
		if (env.NODE_ENV === "production") {
			rest
				.put(Routes.applicationCommands(DISCORD_CLIENT_ID), { body })
				.then(() => logger.info(`Updated ${body.length} global command${body.length === 1 ? "" : "s"}`));
		} else {
			rest
				.put(Routes.applicationGuildCommands(DISCORD_CLIENT_ID, DISCORD_TESTING_GUILD_ID), { body })
				.then(() => logger.info(`Updated ${body.length} local command${body.length === 1 ? "" : "s"}`));
		}
	}
})();

// 4. Log in
client.login(env.DISCORD_TOKEN);

export { client };
