import fs from "node:fs";
import path from "node:path";

/**
 * Recursively reads through a directory
 *
 * @param dirPath - a directory path
 * @param extension - filter results by this extension
 * @param files - file accumulator
 * @returns an array of file paths optionally filtered by extension
 */
export function readdirSyncRecursive(dirPath: string, extension?: string, files: string[] = []) {
	if (!fs.existsSync(dirPath)) return files;
	fs.readdirSync(dirPath, { withFileTypes: true }).forEach((entry) => {
		const entryPath = path.join(dirPath, entry.name);
		if (entry.isDirectory()) readdirSyncRecursive(entryPath, extension, files);
		else {
			if (extension && path.parse(entryPath).ext !== extension) return;
			else files.push(entryPath);
		}
	});
	return files;
}
