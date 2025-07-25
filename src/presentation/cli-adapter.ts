import { hasErrors } from "../application/process-result-types.js";
import { convertFilesUseCase } from "../application/use-cases/convert-files.js";
import type { CLIOptions } from "../domain/cli-options.js";
import { NoFilesFoundError } from "../domain/errors.js";
import { printResults } from "./console-reporter.js";

/**
 * Adapter between CLI and application layer
 * Handles side effects like process.exit and console output
 */
export async function runCommand(
  globPattern: string,
  cliOptions: CLIOptions,
): Promise<void> {
  try {
    // Call the pure use case
    const { results } = await convertFilesUseCase(globPattern, cliOptions);

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
