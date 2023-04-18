import { REST, Routes } from "discord.js";
import { cleanEnv, str } from "envalid";
import { readdirSyncRecursive } from "./utils";
import { DISCORD_TESTING_GUILD_ID, DISCORD_CLIENT_ID } from "./config";
import logger from "./logger";
import path from "node:path";
import dotenv from "dotenv";
import { SlashCommand } from "./structures";
dotenv.config();

const env = cleanEnv(process.env, {
	DISCORD_TOKEN: str(),
	NODE_ENV: str({ choices: ["development", "test", "production", "staging"] }),
});

const rest = new REST({ version: "10" }).setToken(env.DISCORD_TOKEN!);
(async () => {
	const commands = await Promise.all(
		readdirSyncRecursive(path.join(__dirname, "commands"), ".js").map(async (cmdPath) => {
			const command: SlashCommand = await import(cmdPath);
			return command.data.toJSON();
		})
	);

	if (env.NODE_ENV === "production") rest.put(Routes.applicationCommands(DISCORD_CLIENT_ID!), { body: commands });
	else if (DISCORD_TESTING_GUILD_ID) rest.put(Routes.applicationGuildCommands(DISCORD_CLIENT_ID!, DISCORD_TESTING_GUILD_ID), { body: commands });
})().finally(() => logger.info(`Updated ${env.NODE_ENV === "production" ? "global" : "local"} commands`));
