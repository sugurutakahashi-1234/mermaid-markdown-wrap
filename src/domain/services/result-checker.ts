/**
 * Result checker service
 *
 * This service contains business logic for checking conversion results.
 * It implements the business rule that the overall operation fails if
 * any individual file conversion fails.
 */

import type { FileConversionResult } from "../models/result.js";

/**
 * Check if any file conversions failed
 *
 * Business rule: The operation fails if any individual file fails.
 * This determines the exit status of the entire conversion process.
 */
export function hasFailures(results: FileConversionResult[]): boolean {
  return results.some((r) => !r.success);
}
