import { convertFile } from "../application/mermaid-file-processor.js";
import type { ProcessResult } from "../application/process-result-types.js";
import { hasErrors } from "../application/process-result-types.js";
import type { CLIOptions, Options } from "../domain/cli-options.js";
import { NoFilesFoundError } from "../domain/errors.js";
import { loadConfig, mergeOptions } from "../infrastructure/config.js";
import { createDirectory, findFiles } from "../infrastructure/file-system.js";
import { printResults } from "./console-reporter.js";

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
 * Run the CLI command
 */
export async function runCommand(
  globPattern: string,
  cliOptions: CLIOptions,
): Promise<void> {
  try {
    // Load configuration
    const config = await loadConfig(cliOptions.config);

    // Merge options
    const options = mergeOptions(cliOptions, config);

    // Use explicit glob pattern if provided
    const pattern = cliOptions.glob || globPattern;

    // Process files
    const results = await processFiles(pattern, options);

    // Print results
    printResults(results);

    // Exit with error code if there were failures
    if (hasErrors(results)) {
      process.exit(1);
    }
  } catch (error) {
    if (error instanceof NoFilesFoundError) {
      console.error(`Error: ${error.message}`);
      process.exit(1);
    }
    throw error;
  }
}
