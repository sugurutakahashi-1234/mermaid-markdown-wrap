/**
 * Convert files use case
 *
 * This is a simplified use case that orchestrates the file conversion process.
 * It delegates the actual work to the infrastructure layer while maintaining
 * the application flow.
 */

import type { ConversionReport } from "../../domain/models/conversion.js";
import type {
  ProcessingOptions,
  RawCLIOptions,
} from "../../domain/models/options.js";
import { processFiles } from "../../infrastructure/services/file-batch-processor.js";

/**
 * Convert Mermaid files to Markdown format
 *
 * This use case now focuses purely on the business logic:
 * 1. Delegates to the file converter service
 * 2. Aggregates results into ConversionReport
 *
 * Options processing has been moved to the CLI layer for better separation of concerns.
 */
export async function convertFilesUseCase(
  globPattern: string,
  processingOptions: ProcessingOptions,
  rawCliOptions?: RawCLIOptions,
): Promise<ConversionReport> {
  // Delegate the actual conversion to infrastructure service
  // Pass both processing options and raw CLI options (for command display)
  const results = await processFiles(
    globPattern,
    processingOptions,
    rawCliOptions,
  );

  // Aggregate results into conversion report
  const successful = results.filter((r) => r.converted);
  const failed = results.filter((r) => !r.converted);

  return {
    summary: {
      totalMermaidFiles: results.length,
      successfulConversions: successful.length,
      failedConversions: failed.length,
    },
    conversions: results,
  };
}
