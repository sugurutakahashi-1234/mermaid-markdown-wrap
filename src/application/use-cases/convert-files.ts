import type {
  CLIOptions,
  ConfigOptions,
  Options,
} from "../../domain/cli-options.js";
import { NoFilesFoundError } from "../../domain/errors.js";
import { loadConfig, mergeOptions } from "../../infrastructure/config.js";
import {
  createDirectory,
  findFiles,
} from "../../infrastructure/file-system.js";
import { convertFile } from "../mermaid-file-processor.js";
import type { ProcessResult } from "../process-result-types.js";

/**
 * Process all files matching the glob pattern
 */
async function processFiles(
  globPattern: string,
  options: Options,
): Promise<ProcessResult[]> {
  // Find files
  const files = await findFiles(globPattern);

  if (files.length === 0) {
    throw new NoFilesFoundError(globPattern);
  }

  // Create output directory if specified
  if (options.outDir) {
    await createDirectory(options.outDir);
  }

  // Process files in parallel
  const results = await Promise.allSettled(
    files.map(async (file): Promise<ProcessResult> => {
      try {
        await convertFile(file, options);
        return { file, success: true };
      } catch (error) {
        return {
          file,
          success: false,
          error: error instanceof Error ? error : new Error(String(error)),
        };
      }
    }),
  );

  // Transform Promise.allSettled results to ProcessResult[]
  return results.map((result, index) => {
    if (result.status === "fulfilled") {
      return result.value;
    } else {
      return {
        file: files[index] || "unknown",
        success: false,
        error:
          result.reason instanceof Error
            ? result.reason
            : new Error(String(result.reason)),
      };
    }
  });
}

/**
 * Convert files use case
 * Pure business logic without side effects
 */
export async function convertFilesUseCase(
  globPattern: string,
  cliOptions: CLIOptions,
): Promise<{ results: ProcessResult[]; config: ConfigOptions }> {
  // Load configuration
  const config = await loadConfig(cliOptions.config);

  // Merge options
  const options = mergeOptions(cliOptions, config);

  // Use explicit glob pattern if provided
  const pattern = cliOptions.glob || globPattern;

  // Process files
  const results = await processFiles(pattern, options);

  return { results, config };
}
