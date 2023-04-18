/**
 * Formats passed time to human-readable form
 * @example formatPassedTime(8101) // => "2 hours, 15 minutes, 1 second"
 * @param seconds - time to format in seconds
 * @returns formatted time in a string form
 */
export function formatPassedTime(seconds: number) {
	let time = "";
	const days = Math.floor(seconds / 86400);
	const hours = Math.floor(seconds / 3600) % 24;
	const minutes = Math.floor(seconds / 60) % 60;
	if (days > 0) time += days === 1 ? "1 day " : `${days} days `;
	if (hours > 0) time += hours === 1 ? "1 hour " : `${hours} hours `;
	if (minutes > 0) time += minutes === 1 ? "1 minute" : `${minutes} minutes`;
	else time += seconds === 1 ? "1 second" : `${seconds} seconds`;
	return time;
}
