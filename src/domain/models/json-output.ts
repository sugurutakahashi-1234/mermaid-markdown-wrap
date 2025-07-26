/**
 * JSON output format models
 *
 * These types define the structure of the JSON output when --output-json is used.
 * This is a domain model because it represents the business concept of
 * "structured output for programmatic consumption".
 */

/**
 * Root structure of the JSON output with aggregated results
 */
export interface ConversionResultOutput {
  totalFiles: number;
  successful: number;
  failed: number;
  files: Array<{
    source: string;
    output: string;
    success: boolean;
    error?: string;
  }>;
}
