/**
 * Result of processing a single file
 */
export interface ProcessResult {
  file: string;
  success: boolean;
  error?: Error;
}

/**
 * Check if all files were processed successfully
 */
export function hasErrors(results: ProcessResult[]): boolean {
  return results.some((r) => !r.success);
}
