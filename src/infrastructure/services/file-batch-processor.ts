/**
 * Batch processor - handles batch file processing
 *
 * This module manages the technical aspects of processing multiple files
 * in parallel, including error handling and result aggregation.
 */

import type { MermaidConversion } from "../../domain/models/conversion.js";
import { NoFilesFoundError } from "../../domain/models/errors.js";
import type {
  ProcessingOptions,
  RawCLIOptions,
} from "../../domain/models/options.js";
import { generateCommandInfo } from "../../domain/services/command-info-generator.js";
import { formatMermaidAsMarkdown } from "../../domain/services/mermaid-formatter.js";
import { getOutputPath } from "../../domain/services/path-calculator.js";
import {
  createDirectory,
  deleteFile,
  readTextFile,
  readTextFileIfExists,
  writeTextFile,
} from "../adapters/file-system.adapter.js";
import { findFilesByPattern } from "../adapters/glob-search.adapter.js";

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
  options: ProcessingOptions,
  rawCliOptions?: RawCLIOptions,
): Promise<MermaidConversion[]> {
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
  // Use raw CLI options if available to show exact user input
  const commandInfo =
    !options.hideCommand && rawCliOptions
      ? generateCommandInfo(pattern, rawCliOptions)
      : undefined;

  // Process files in parallel with error handling
  const results = await Promise.allSettled(
    files.map(async (filePath): Promise<MermaidConversion> => {
      try {
        // Calculate output path before conversion
        const outputPath = getOutputPath(filePath, options);

        // Read source content
        const content = await readTextFile(filePath);

        // Apply business rule: format as markdown
        const formattedContent = formatMermaidAsMarkdown(
          content,
          options,
          commandInfo,
        );

        // Check if the output file exists and compare content
        const existingContent = await readTextFileIfExists(outputPath);
        const isChanged =
          !existingContent || existingContent !== formattedContent;

        // Write formatted content
        await writeTextFile(outputPath, formattedContent);

        // Delete source if requested
        if (options.removeSource) {
          await deleteFile(filePath);
        }

        return {
          mermaidFile: filePath,
          converted: true,
          markdownFile: outputPath,
          changed: isChanged,
        };
      } catch (error) {
        return {
          mermaidFile: filePath,
          converted: false,
          markdownFile: "",
          failureReason: error instanceof Error ? error.message : String(error),
          changed: false,
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
      mermaidFile: files[index] || "unknown",
      converted: false,
      markdownFile: "",
      failureReason:
        result.reason instanceof Error
          ? result.reason.message
          : String(result.reason),
      changed: false,
    };
  });
}
