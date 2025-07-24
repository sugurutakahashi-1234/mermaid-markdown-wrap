import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import { globby } from "globby";

/**
 * Find files matching the glob pattern
 */
export async function findFiles(globPattern: string): Promise<string[]> {
  return await globby(globPattern);
}

/**
 * Read file content as UTF-8
 */
export async function readFileContent(filePath: string): Promise<string> {
  return await readFile(filePath, "utf-8");
}

/**
 * Write content to file as UTF-8
 */
export async function writeFileContent(
  filePath: string,
  content: string,
): Promise<void> {
  await writeFile(filePath, content, "utf-8");
}

/**
 * Delete a file
 */
export async function deleteFile(filePath: string): Promise<void> {
  await unlink(filePath);
}

/**
 * Create directory recursively
 */
export async function createDirectory(path: string): Promise<void> {
  await mkdir(path, { recursive: true });
}
