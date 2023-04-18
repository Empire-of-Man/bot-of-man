import { createLogger, format, transports } from "winston";
import { LOG_LEVEL } from "./config";

const logger = createLogger({
	level: LOG_LEVEL,
	format: format.combine(format.timestamp(), format.json()),
	levels: {
		fatal: 0,
		error: 1,
		warn: 2,
		info: 3,
		debug: 4,
	},
	transports: [
		new transports.File({ filename: "./logs/error.log", level: "error", options: { flags: "w" } }),
		new transports.File({ filename: "./logs/info.log", level: "info", options: { flags: "w" } }),
		new transports.File({ filename: "./logs/debug.log", level: "debug", options: { flags: "w" } }),
	],
	exceptionHandlers: [new transports.File({ filename: "./logs/fatal.log", level: "fatal" })],
});

if (process.env.NODE_ENV !== "production") {
	logger.add(
		new transports.Console({
			format: format.combine(format.timestamp({ format: "DD-MM-YYYY HH:mm:ss" }), format.json({ space: 2 }), format.colorize({ all: true })),
		})
	);
}

export default logger;
