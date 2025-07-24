import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import { basename, dirname, extname, join } from "node:path";
import { buildMarkdownContent } from "../application/converter.js";
import type { Options } from "../domain/types.js";

/**
 * Convert a single .mmd file to markdown format
 */
export async function convertFile(
  filePath: string,
  options: Options,
): Promise<void> {
  // Read the source file
  const content = await readFile(filePath, "utf-8");

  // Build the output content
  const outputContent = buildMarkdownContent(content, options);

  // Determine output path
  const outputPath = getOutputPath(filePath, options);

  // Write the output file
  await writeFile(outputPath, outputContent, "utf-8");

  // Delete source file if not keeping it
  if (!options.keepSource) {
    await unlink(filePath);
  }
}

/**
 * Get the output file path based on options
 */
function getOutputPath(inputPath: string, options: Options): string {
  const dir = dirname(inputPath);
  const baseName = basename(inputPath, extname(inputPath));
  const outputDir = options.outDir || dir;
  const outputFileName = `${baseName}${options.extension}`;

  return join(outputDir, outputFileName);
}

/**
 * Create directory recursively
 */
export async function createDirectory(path: string): Promise<void> {
  await mkdir(path, { recursive: true });
}
