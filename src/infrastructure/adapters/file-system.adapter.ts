/**
 * File system adapter
 *
 * This adapter provides a thin wrapper around Node.js file system operations.
 * It abstracts the technical details of file I/O operations.
 */

import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

/**
 * Read file content as UTF-8
 */
export async function readTextFile(filePath: string): Promise<string> {
  return await readFile(filePath, "utf-8");
}

/**
 * Read file content as UTF-8 if it exists, otherwise return null
 */
export async function readTextFileIfExists(
  filePath: string,
): Promise<string | null> {
  try {
    return await readFile(filePath, "utf-8");
  } catch (error) {
    // If file doesn't exist, return null
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }
    // Re-throw other errors
    throw error;
  }
}

/**
 * Write text content to file as UTF-8
 */
export async function writeTextFile(
  filePath: string,
  content: string,
): Promise<void> {
  await writeFile(filePath, content, "utf-8");
}

/**
 * Delete a file from the file system
 */
export async function deleteFile(filePath: string): Promise<void> {
  await unlink(filePath);
}

/**
 * Create a directory (including parent directories)
 */
export async function createDirectory(path: string): Promise<void> {
  await mkdir(path, { recursive: true });
}

/**
 * File system adapter as an object (for easier imports)
 */
export const fileSystemAdapter = {
  readFile: readTextFile,
  readFileIfExists: readTextFileIfExists,
  writeFile: writeTextFile,
  deleteFile,
  createDirectory,
  resolvePath: resolve,
};
