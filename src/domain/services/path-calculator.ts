/**
 * Path calculation service
 *
 * This service contains the business logic for determining output paths
 * based on input paths and options. This is a domain concern as it
 * implements the rules for how files should be named and where they
 * should be placed.
 */

import { basename, dirname, extname, join } from "node:path";
import type { ProcessingOptions } from "../models/options.js";

/**
 * Calculate output path for a converted file
 *
 * Business rule: Output files should:
 * - Use the same base name as input
 * - Always use .md extension
 * - Be placed in outDir if specified, otherwise same directory as input
 */
export function getOutputPath(
  inputPath: string,
  options: ProcessingOptions,
): string {
  const dir = dirname(inputPath);
  const baseName = basename(inputPath, extname(inputPath));
  const outputDir = options.outDir || dir;
  const outputFileName = `${baseName}.md`;

  return join(outputDir, outputFileName);
}
