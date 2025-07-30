import type {
  ProcessingOptions,
  RawCLIOptions,
} from "../../domain/models/options.js";
import { parseRawCLIOptions } from "../../domain/services/cli-options-parser.js";
import { combineOptions } from "../../domain/services/options-combiner.js";
import { loadConfigurationFile } from "../../infrastructure/adapters/cosmiconfig.adapter.js";

/**
 * Result of loading and combining configuration
 */
interface LoadAndCombineConfigResult {
  rawCliOptions: RawCLIOptions;
  processingOptions: ProcessingOptions;
}

/**
 * Load configuration and combine with CLI options use case
 *
 * Purpose: Encapsulate the configuration loading logic in the application layer
 * to avoid direct infrastructure layer access from the presentation layer
 *
 * @param cmdOptions - Raw command options from commander
 * @returns Both raw CLI options and processed options with defaults
 */
export async function loadAndCombineConfigUseCase(
  cmdOptions: unknown,
): Promise<LoadAndCombineConfigResult> {
  // Parse and validate raw CLI options (exactly what user typed)
  const rawCliOptions = parseRawCLIOptions(cmdOptions);

  // Load configuration and combine with CLI options
  const config = await loadConfigurationFile(rawCliOptions.config);
  const processingOptions = combineOptions(rawCliOptions, config);

  return {
    rawCliOptions,
    processingOptions,
  };
}
