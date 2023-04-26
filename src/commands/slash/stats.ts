import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder, Status } from "discord.js";
import { SlashCommand } from "../../structures";
import { formatPassedTime } from "../../utils";

export const command = new SlashCommand({
	data: new SlashCommandBuilder().setName("stats").setDescription("Show bot statistics.").toJSON(),
	run: async (i: ChatInputCommandInteraction) => {
		const message = {
			embeds: [
				new EmbedBuilder().setColor("#2B2D31").addFields([
					{
						name: "Information",
						value: "```" + `Version: ${process.env.npm_package_version ?? "N/A"}\n` + `Node.js: ${process.versions["node"]}\n` + "```",
					},
					{
						name: "Websocket",
						value:
							"```" +
							`Uptime: ${formatPassedTime(Math.floor(i.client.uptime / 1000))}\n` +
							`Status: ${Status[i.client.ws.status]}\n` +
							`Ping: ${i.client.ws.ping}ms\n` +
							"```",
					},
				]),
			],
		};

		return i.reply(message);
	},
});
