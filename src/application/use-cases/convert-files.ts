/**
 * Convert files use case
 *
 * This is a simplified use case that orchestrates the file conversion process.
 * It delegates the actual work to the infrastructure layer while maintaining
 * the application flow.
 */

import type { ConfigOptions } from "../../domain/models/options.js";
import type { FileConversionResult } from "../../domain/models/result.js";
import { parseCLIOptions } from "../../domain/services/cli-options-parser.js";
import { mergeOptions } from "../../domain/services/options-merger.js";
import { loadConfigurationFile } from "../../infrastructure/adapters/cosmiconfig.adapter.js";
import { processFiles } from "../../infrastructure/services/file-batch-processor.js";

/**
 * Convert Mermaid files to Markdown format
 *
 * This use case:
 * 1. Validates CLI options
 * 2. Loads configuration
 * 3. Merges options
 * 4. Delegates to the file converter service
 */
export async function convertFilesUseCase(
  globPattern: string,
  rawCliOptions: unknown,
): Promise<{ results: FileConversionResult[]; config: ConfigOptions }> {
  // Validate CLI options within the use case
  const cliOptions = parseCLIOptions(rawCliOptions);
  // Load configuration from file
  const config = await loadConfigurationFile(cliOptions.config);

  // Merge CLI options with config file options
  const options = mergeOptions(cliOptions, config);

  // Delegate the actual conversion to infrastructure service
  const results = await processFiles(
    globPattern,
    options,
    globPattern,
    cliOptions,
  );

  return { results, config };
}
