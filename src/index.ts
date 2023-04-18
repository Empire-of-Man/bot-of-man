import { ActivityType, GatewayIntentBits } from "discord.js";
import { BotClient, Event, SlashCommand } from "./structures";
import { readdirSyncRecursive } from "./utils";
import { cleanEnv, str } from "envalid";
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
	intents: [GatewayIntentBits.Guilds],
	presence: { activities: [{ type: ActivityType.Watching, name: "the Empire grow" }] },
});

// 2. Initialize commands
readdirSyncRecursive(path.join(__dirname, "commands"), ".js").forEach(async (cmdPath) => {
	const command: SlashCommand = (await import(cmdPath)).command;
	client.slashCommands.set(command.data.name, command);
});

// 3. Initialize events
readdirSyncRecursive(path.join(__dirname, "events"), ".js").forEach(async (cmdPath) => {
	const event: Event = (await import(cmdPath)).event;
	if (event.once) client.once(event.type, event.handler);
	else client.on(event.type, event.handler);
});

// 4. Log in
client.login(env.DISCORD_TOKEN);

export { client };
