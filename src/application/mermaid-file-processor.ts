import { basename, dirname, extname, join } from "node:path";
import type { Options } from "../domain/cli-options.js";
import {
  deleteFile,
  readFileContent,
  writeFileContent,
} from "../infrastructure/file-system.js";
import { buildMarkdownContent } from "./markdown-builder.js";

/**
 * Convert a single .mmd file to markdown format
 */
export async function convertFile(
  filePath: string,
  options: Options,
): Promise<void> {
  // Read the source file
  const content = await readFileContent(filePath);

  // Build the output content
  const outputContent = buildMarkdownContent(content, options);

  // Determine output path
  const outputPath = getOutputPath(filePath, options);

  // Write the output file
  await writeFileContent(outputPath, outputContent);

  // Delete source file if not keeping it
  if (!options.keepSource) {
    await deleteFile(filePath);
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
