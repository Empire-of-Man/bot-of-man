import { ActionRowBuilder, ButtonInteraction, ButtonStyle, EmbedBuilder, APIActionRowComponent, APIMessageActionRowComponent, APIEmbed } from "discord.js";
import { Button, AnyMessageComponentBuilder } from "./Components";

export class Pagination {
	pages: { embeds: APIEmbed[]; components?: APIActionRowComponent<APIMessageActionRowComponent>[] }[];
	private currentPage: number = 0;

	toFirstPage = async (i: ButtonInteraction) => {
		this.currentPage = 0;
		return i.update(this.pages[this.currentPage]);
	};

	toPreviousPage = async (i: ButtonInteraction) => {
		this.currentPage = Math.max(0, this.currentPage - 1);
		return i.update(this.pages[this.currentPage]);
	};

	toNextPage = async (i: ButtonInteraction) => {
		this.currentPage = Math.min(this.pages.length - 1, this.currentPage + 1);
		return i.update(this.pages[this.currentPage]);
	};

	toLastPage = async (i: ButtonInteraction) => {
		this.currentPage = this.pages.length - 1;
		return i.update(this.pages[this.currentPage]);
	};

	constructor(pages: { embeds: EmbedBuilder[]; components?: ActionRowBuilder<AnyMessageComponentBuilder>[] }[], buttonRow: 0 | 1 | 2 | 3 | 4 = 0) {
		this.pages = pages.map((page, index) => {
			const navActionRow = new ActionRowBuilder<Button>().addComponents([
				new Button({
					style: ButtonStyle.Primary,
					emoji: { id: "1100091947332415508", name: "first" },
					disabled: index === 0,
					handler: (i: ButtonInteraction) => this.toFirstPage(i),
				}),
				new Button({
					style: ButtonStyle.Primary,
					emoji: { id: "1100091944509636629", name: "left" },
					disabled: index === 0,
					handler: (i: ButtonInteraction) => this.toPreviousPage(i),
				}),
				new Button({
					style: ButtonStyle.Secondary,
					label: `${index + 1}/${pages.length}`,
					disabled: true,
				}),
				new Button({
					style: ButtonStyle.Primary,
					emoji: { id: "1100091942873866441", name: "right" },
					disabled: index === pages.length - 1,
					handler: (i: ButtonInteraction) => this.toNextPage(i),
				}),
				new Button({
					style: ButtonStyle.Primary,
					emoji: { id: "1100091939925270528", name: "last" },
					disabled: index === pages.length - 1,
					handler: (i: ButtonInteraction) => this.toLastPage(i),
				}),
			]);
			if (!page.components) page.components = [navActionRow];
			else if (page.components.length >= 5) page.components.slice(0, 5)[buttonRow] = navActionRow;
			else page.components.splice(buttonRow, 0, navActionRow);
			return {
				embeds: page.embeds.map((embed) => embed.toJSON()),
				components: page.components.map((component) => component.toJSON()),
			};
		});
	}
}
