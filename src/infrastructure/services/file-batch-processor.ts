/**
 * Batch processor - handles batch file processing
 *
 * This module manages the technical aspects of processing multiple files
 * in parallel, including error handling and result aggregation.
 */

import { NoFilesFoundError } from "../../domain/models/errors.js";
import type { CLIOptions, Options } from "../../domain/models/options.js";
import type { FileConversionResult } from "../../domain/models/result.js";
import { generateCommandInfo } from "../../domain/services/command-info-generator.js";
import { formatMermaidAsMarkdown } from "../../domain/services/mermaid-formatter.js";
import { getOutputPath } from "../../domain/services/path-calculator.js";
import {
  createDirectory,
  deleteFile,
  readTextFile,
  writeTextFile,
} from "../adapters/file-system.adapter.js";
import { findFilesByPattern } from "../adapters/glob-search.adapter.js";

/**
 * Convert a single file
 */
async function convertSingleFile(
  filePath: string,
  options: Options,
  commandInfo?: string,
): Promise<void> {
  // Read source content
  const content = await readTextFile(filePath);

  // Apply business rule: format as markdown
  const formattedContent = formatMermaidAsMarkdown(
    content,
    options,
    commandInfo,
  );

  // Calculate output path
  const outputPath = getOutputPath(filePath, options);

  // Write formatted content
  await writeTextFile(outputPath, formattedContent);

  // Delete source if requested
  if (options.removeSource) {
    await deleteFile(filePath);
  }
}

/**
 * Process multiple Mermaid files in parallel
 *
 * This function handles the technical aspects of:
 * - Finding files matching the pattern
 * - Creating output directories
 * - Processing files in parallel
 * - Aggregating results with error handling
 */
export async function processFiles(
  pattern: string,
  options: Options,
  globPattern: string,
  cliOptions: CLIOptions,
): Promise<FileConversionResult[]> {
  // Find files matching pattern
  const files = await findFilesByPattern(pattern);

  if (files.length === 0) {
    throw new NoFilesFoundError(pattern);
  }

  // Ensure output directory exists
  if (options.outDir) {
    await createDirectory(options.outDir);
  }

  // Generate command info once for all files
  const commandInfo = options.showCommand
    ? generateCommandInfo(globPattern, cliOptions)
    : undefined;

  // Process files in parallel with error handling
  const results = await Promise.allSettled(
    files.map(async (filePath): Promise<FileConversionResult> => {
      try {
        await convertSingleFile(filePath, options, commandInfo);
        return { filePath, success: true };
      } catch (error) {
        return {
          filePath,
          success: false,
          error: error instanceof Error ? error : new Error(String(error)),
        };
      }
    }),
  );

  // Transform Promise.allSettled results
  return results.map((result, index) => {
    if (result.status === "fulfilled") {
      return result.value;
    }
    return {
      filePath: files[index] || "unknown",
      success: false,
      error:
        result.reason instanceof Error
          ? result.reason
          : new Error(String(result.reason)),
    };
  });
}
