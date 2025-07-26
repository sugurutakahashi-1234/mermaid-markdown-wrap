/**
 * Convert files use case
 *
 * This is a simplified use case that orchestrates the file conversion process.
 * It delegates the actual work to the infrastructure layer while maintaining
 * the application flow.
 */

import type { ConversionResultOutput } from "../../domain/models/json-output.js";
import type { CLIOptions } from "../../domain/models/options.js";
import { mergeOptions } from "../../domain/services/options-merger.js";
import { loadConfigurationFile } from "../../infrastructure/adapters/cosmiconfig.adapter.js";
import { processFiles } from "../../infrastructure/services/file-batch-processor.js";

/**
 * Convert Mermaid files to Markdown format
 *
 * This use case:
 * 1. Loads configuration
 * 2. Merges options
 * 3. Delegates to the file converter service
 * 4. Aggregates results into ConversionResultOutput
 */
export async function convertFilesUseCase(
  globPattern: string,
  cliOptions: CLIOptions,
): Promise<ConversionResultOutput> {
  // Load configuration from file
  const config = await loadConfigurationFile(cliOptions.config);

  // Merge CLI options with config file options
  const options = mergeOptions(cliOptions, config);

  // Delegate the actual conversion to infrastructure service
  const results = await processFiles(globPattern, options, cliOptions);

  // Aggregate results into structured output
  const successful = results.filter((r) => r.success);
  const failed = results.filter((r) => !r.success);

  const files = results.map((result) => ({
    source: result.filePath,
    output: result.outputPath || "",
    success: result.success,
    ...(result.error?.message && { error: result.error.message }),
  }));

  return {
    totalFiles: results.length,
    successful: successful.length,
    failed: failed.length,
    files,
  };
}
