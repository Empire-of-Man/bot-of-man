import {
	APIButtonComponent,
	APIChannelSelectComponent,
	APIMentionableSelectComponent,
	APIMessageActionRowComponent,
	APIRoleSelectComponent,
	APIStringSelectComponent,
	APIUserSelectComponent,
	ButtonBuilder,
	ButtonInteraction,
	ChannelSelectMenuBuilder,
	ChannelSelectMenuInteraction,
	InteractionResponse,
	MentionableSelectMenuBuilder,
	MentionableSelectMenuInteraction,
	MessageComponentInteraction,
	RoleSelectMenuBuilder,
	RoleSelectMenuInteraction,
	StringSelectMenuBuilder,
	StringSelectMenuInteraction,
	UserSelectMenuBuilder,
	UserSelectMenuInteraction,
} from "discord.js";
import { client } from "../index";
import { BotClient } from ".";

type NoTypeAndID<T extends APIMessageActionRowComponent> = Omit<T, "type" | "custom_id">;
export type ComponentHandler<I extends MessageComponentInteraction> = (i: I & { client: BotClient }) => Promise<InteractionResponse<boolean>>;
export type AnyMessageComponentBuilder =
	| ButtonBuilder
	| StringSelectMenuBuilder
	| UserSelectMenuBuilder
	| RoleSelectMenuBuilder
	| MentionableSelectMenuBuilder
	| ChannelSelectMenuBuilder;
export type AnyMessageComponentHandler =
	| ComponentHandler<ButtonInteraction>
	| ComponentHandler<StringSelectMenuInteraction>
	| ComponentHandler<UserSelectMenuInteraction>
	| ComponentHandler<RoleSelectMenuInteraction>
	| ComponentHandler<MentionableSelectMenuInteraction>
	| ComponentHandler<ChannelSelectMenuInteraction>;

export class Button extends ButtonBuilder {
	constructor(data: NoTypeAndID<APIButtonComponent> & { handler?: ComponentHandler<ButtonInteraction> }) {
		super(data);
		this.setCustomId(getHandlerUUID(data.handler as ComponentHandler<MessageComponentInteraction>));
		if (!this.data.label && !this.data.emoji) this.setEmoji("<:transparent:1097883268453507103>");
	}
}

export class StringSelectMenu extends StringSelectMenuBuilder {
	constructor(data: NoTypeAndID<APIStringSelectComponent> & { handler?: ComponentHandler<StringSelectMenuInteraction> }) {
		super(data);
		this.setCustomId(getHandlerUUID(data.handler as ComponentHandler<MessageComponentInteraction>));
	}
}

export class UserSelectMenu extends UserSelectMenuBuilder {
	constructor(data: NoTypeAndID<APIUserSelectComponent> & { handler?: ComponentHandler<UserSelectMenuInteraction> }) {
		super(data);
		this.setCustomId(getHandlerUUID(data.handler as ComponentHandler<MessageComponentInteraction>));
	}
}

export class RoleSelectMenu extends RoleSelectMenuBuilder {
	constructor(data: NoTypeAndID<APIRoleSelectComponent> & { handler?: ComponentHandler<RoleSelectMenuInteraction> }) {
		super(data);
		this.setCustomId(getHandlerUUID(data.handler as ComponentHandler<MessageComponentInteraction>));
	}
}

export class MentionableSelectMenu extends MentionableSelectMenuBuilder {
	constructor(data: NoTypeAndID<APIMentionableSelectComponent> & { handler?: ComponentHandler<MentionableSelectMenuInteraction> }) {
		super(data);
		this.setCustomId(getHandlerUUID(data.handler as ComponentHandler<MessageComponentInteraction>));
	}
}

export class ChannelSelectMenu extends ChannelSelectMenuBuilder {
	constructor(data: NoTypeAndID<APIChannelSelectComponent> & { handler?: ComponentHandler<ChannelSelectMenuInteraction> }) {
		super(data);
		this.setCustomId(getHandlerUUID(data.handler as ComponentHandler<MessageComponentInteraction>));
	}
}

function getHandlerUUID(handler?: ComponentHandler<MessageComponentInteraction>) {
	const UUID = crypto.randomUUID();
	if (!handler) return UUID;

	const existingHandlerUUID = client.componentHandlers.findKey((func) => String(func) === String(handler));
	if (existingHandlerUUID) return existingHandlerUUID + "." + UUID;
	else {
		if (client.componentHandlers.has(UUID)) throw new Error("UUID collision!");
		else client.componentHandlers.set(UUID, handler);
	}

	return UUID + "." + crypto.randomUUID();
}
