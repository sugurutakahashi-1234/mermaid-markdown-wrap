/**
 * Glob search adapter
 *
 * This adapter provides glob pattern matching functionality
 * using the globby library.
 */

import { globby } from "globby";

/**
 * Find files matching the glob pattern
 *
 * Uses globby to search for files with support for:
 * - Standard glob patterns (*, **, ?, etc.)
 * - Multiple patterns
 * - Negation patterns
 */
export async function findFilesByPattern(
  globPattern: string,
): Promise<string[]> {
  return await globby(globPattern);
}
