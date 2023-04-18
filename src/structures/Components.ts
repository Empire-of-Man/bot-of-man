import {
	APIButtonComponent,
	APIChannelSelectComponent,
	APIMentionableSelectComponent,
	APIMessageActionRowComponent,
	APIRoleSelectComponent,
	APIStringSelectComponent,
	APIUserSelectComponent,
	ButtonBuilder,
	ChannelSelectMenuBuilder,
	MentionableSelectMenuBuilder,
	MessageComponentInteraction,
	RoleSelectMenuBuilder,
	StringSelectMenuBuilder,
	UserSelectMenuBuilder,
} from "discord.js";
import { client } from "../index";

type NoCommonProps<T extends APIMessageActionRowComponent> = Omit<T, "type" | "custom_id">;

export class Button extends ButtonBuilder {
	constructor(data: NoCommonProps<APIButtonComponent>, handler?: (i: MessageComponentInteraction) => any) {
		super(data);
		this.setCustomId(getHandlerUUID(handler));
		if (!this.data.label && !this.data.emoji) this.setEmoji("<:transparent:1097883268453507103>");
	}
}

export class StringSelectMenu extends StringSelectMenuBuilder {
	constructor(data: NoCommonProps<APIStringSelectComponent>, handler?: (i: MessageComponentInteraction) => any) {
		super(data);
		this.setCustomId(getHandlerUUID(handler));
	}
}

export class UserSelectMenu extends UserSelectMenuBuilder {
	constructor(data: NoCommonProps<APIUserSelectComponent>, handler?: (i: MessageComponentInteraction) => any) {
		super(data);
		this.setCustomId(getHandlerUUID(handler));
	}
}

export class RoleSelectMenu extends RoleSelectMenuBuilder {
	constructor(data: NoCommonProps<APIRoleSelectComponent>, handler?: (i: MessageComponentInteraction) => any) {
		super(data);
		this.setCustomId(getHandlerUUID(handler));
	}
}

export class MentionableSelectMenu extends MentionableSelectMenuBuilder {
	constructor(data: NoCommonProps<APIMentionableSelectComponent>, handler?: (i: MessageComponentInteraction) => any) {
		super(data);
		this.setCustomId(getHandlerUUID(handler));
	}
}

export class ChannelSelectMenu extends ChannelSelectMenuBuilder {
	constructor(data: NoCommonProps<APIChannelSelectComponent>, handler?: (i: MessageComponentInteraction) => any) {
		super(data);
		this.setCustomId(getHandlerUUID(handler));
	}
}

function getHandlerUUID(handler?: (i: MessageComponentInteraction) => any) {
	const UUID = crypto.randomUUID();
	if (!handler) return UUID;

	const existingHandlerUUID = client.handlers.findKey((func) => String(func) === String(handler));
	if (existingHandlerUUID) return existingHandlerUUID + "." + UUID;
	else {
		if (client.handlers.has(UUID)) throw new Error("UUID collision!");
		else client.handlers.set(UUID, handler);
	}

	return UUID + "." + crypto.randomUUID();
}
