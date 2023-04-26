import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuInteraction } from "discord.js";
import { AnyMessageComponentBuilder, Pagination, SlashCommand, StringSelectMenu } from "../../structures";
import { toOrdinal, toTitleCase } from "../../utils";
import { env } from "../../index";
import { API_URL, DISCORD_MAIN_GUILD_ID } from "../../config";

interface User {
	discordId: string;
	country: string;
	region?: string;
	clubs: string[];
	league: {
		rank: number;
		division: number;
		group: number;
	};
	score: {
		glory: number; // Global Points
		honour: number; // National Points
		trophies: number; // Global Club Points
		medals: number; // National Club Points
		prestige: number; // League Points
	};
}

export const command = new SlashCommand({
	data: new SlashCommandBuilder()
		.setName("leaderboard")
		.setDescription("Shows the leaderboard.")
		.addSubcommand((subcommand) => subcommand.setName("glory").setDescription("Glory Leaderboard"))
		.addSubcommand((subcommand) => subcommand.setName("honour").setDescription("Honour Leaderboard"))
		.addSubcommand((subcommand) => subcommand.setName("prestige").setDescription("Prestige Leaderboard"))
		.toJSON(),

	run: async (i: ChatInputCommandInteraction) => {
		const apiUserData: User[] = await (await fetch(`http://${API_URL}/api/users`, { headers: { Authorization: `Bearer ${env.API_KEY}` } })).json();
		const guildMembers = await (await i.client.guilds.fetch(DISCORD_MAIN_GUILD_ID)).members.fetch();

		const users = guildMembers
			.filter((member) => apiUserData.some((userData) => userData.discordId === member.id))
			.map((member) => {
				const { discordId, ...apiUser } = apiUserData.find((userData) => userData.discordId === member.id)!;
				return { id: member.id, tag: member.user.tag, ...apiUser };
			});

		const leaderboardType = i.options.getSubcommand(true);
		const pageTemplate = {
			embeds: [
				new EmbedBuilder()
					.setColor("#2B2D31")
					.setAuthor({
						name: "Empire of Man",
						iconURL: "https://cdn.discordapp.com/icons/1068145293306106006/44815d1dff464a1b071f3f521dc0097a.jpg",
						url: "https://discord.com/servers/empire-of-man-1068145293306106006",
					})
					.setTitle(`__${toTitleCase(leaderboardType)} Leaderboard__`),
			],
		};

		let leaderboardMenu: { components: ActionRowBuilder<AnyMessageComponentBuilder>[] | undefined } = { components: undefined };
		if (leaderboardType === "glory")
			leaderboardMenu.components = [
				new ActionRowBuilder<StringSelectMenu>().addComponents(
					new StringSelectMenu({
						options: [
							{ label: "People", value: "people" },
							{ label: "Countries", value: "countries" },
						],

						handler: (i: StringSelectMenuInteraction) => {
							if (i.values[0] === "people") {
								const userScores = new Map(users.map((user) => [`${user.tag} (<@${user.id}>)`, user.score.glory]));
								return i.update(new Pagination(generateLeaderboardPages("Glory", userScores, pageTemplate)).pages[0]);
							} else {
								const countryScores: Map<string, number> = new Map();
								users.forEach((user) => {
									const score = countryScores.get(user.country);
									countryScores.set(user.country, score ? score + user.score.glory : user.score.glory);
								});
								return i.update(new Pagination(generateLeaderboardPages("Glory", countryScores, pageTemplate)).pages[0]);
							}
						},
					})
				),
			];
		else if (leaderboardType === "honour")
			leaderboardMenu.components = [
				new ActionRowBuilder<StringSelectMenu>().addComponents(
					new StringSelectMenu({
						options: [
							{ label: "People", value: "people" },
							{ label: "Regions", value: "regions" },
						],

						handler: (i: StringSelectMenuInteraction) => {
							if (i.values[0] === "people") {
								const userScores = new Map(users.map((user) => [`${user.tag} (<@${user.id}>)`, user.score.honour]));
								return i.update(new Pagination(generateLeaderboardPages("Honour", userScores, pageTemplate)).pages[0]);
							} else {
								const country = users.find((user) => user.id === i.user.id)!.country!;
								const filteredUsers = users.filter((user) => user.country === country);

								const regionScores: Map<string, number> = new Map();

								filteredUsers.forEach((user) => {
									const score = regionScores.get(user.country);
									regionScores.set(user.region ? user.region : `${user.country} Regions`, score ? score + user.score.honour : user.score.honour);
								});

								return i.update(new Pagination(generateLeaderboardPages("Honour", regionScores, pageTemplate)).pages[0]);
							}
						},
					})
				),
			];
		else if (leaderboardType === "prestige")
			leaderboardMenu.components = [
				new ActionRowBuilder<StringSelectMenu>().addComponents(
					new StringSelectMenu({
						options: [{ label: "People", value: "people" }],
						handler: (i: StringSelectMenuInteraction) => {
							const userScores = new Map(users.map((user) => [`${user.tag} (<@${user.id}>)`, user.score.prestige]));
							return i.update(new Pagination(generateLeaderboardPages("Prestige", userScores, pageTemplate)).pages[0]);
						},
					})
				),
			];

		return i.reply(leaderboardMenu);
	},
});

function generateLeaderboardPages(scoreName: string, scores: Map<string, number>, template: { embeds: EmbedBuilder[]; components?: ActionRowBuilder[] }) {
	const pages: { embeds: EmbedBuilder[]; components?: ActionRowBuilder<AnyMessageComponentBuilder>[] }[] = new Array();
	const sortedScores = new Map([...scores.entries()].sort((a, b) => b[1] - a[1]));
	const entryArray = Array.from(sortedScores.entries());
	entryArray.forEach((entry, index) => {
		const entryField = {
			name: " ",
			value: `**${toOrdinal(index)} — ${entry[0]}**\n` + "```arm\n" + `${scoreName}: ${entry[1]}` + "\n```",
		};
		if (index % 10 === 0) pages.push({ embeds: [new EmbedBuilder(template.embeds[0].data)] });
		else pages.at(-1)!.embeds.at(-1)?.addFields(entryField);
	});

	return pages;
}
