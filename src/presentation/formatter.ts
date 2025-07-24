import type { ProcessResult } from "../application/processor.js";

/**
 * Print processing results
 */
export function printResults(results: ProcessResult[]): void {
  const failureCount = results.filter((r) => !r.success).length;

  console.log(`Converting ${results.length} file(s)...`);

  for (const result of results) {
    if (result.success) {
      console.log(`✓ ${result.file}`);
    } else {
      console.error(`✗ ${result.file}: ${result.error?.message}`);
    }
  }

  if (failureCount === 0) {
    console.log("Done!");
  } else {
    console.error(`\nCompleted with ${failureCount} error(s)`);
  }
}
