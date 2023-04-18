import { ClientEvents } from "discord.js";

/**
 * An event that the client listens to
 */
export class Event {
	constructor(options: { type: keyof ClientEvents; handler: (...args: any) => any; once?: boolean }) {
		this.type = options.type;
		this.handler = options.handler;
		if (options.once) this.once = options.once;
	}
	type: keyof ClientEvents;
	handler: (...args: any) => any;
	once: boolean = false;
}
