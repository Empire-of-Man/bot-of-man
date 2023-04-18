import { EmbedBuilder, Status, ChatInputCommandInteraction } from "discord.js";
import { formatPassedTime } from "../utils";

export function createMessage(i: ChatInputCommandInteraction) {
	return {
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
}
