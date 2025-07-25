/**
 * Path calculation service
 *
 * This service contains the business logic for determining output paths
 * based on input paths and options. This is a domain concern as it
 * implements the rules for how files should be named and where they
 * should be placed.
 */

import { basename, dirname, extname, join } from "node:path";
import type { Options } from "../models/options.js";

/**
 * Calculate output path for a converted file
 *
 * Business rule: Output files should:
 * - Use the same base name as input
 * - Use the extension from options
 * - Be placed in outDir if specified, otherwise same directory as input
 */
export function getOutputPath(inputPath: string, options: Options): string {
  const dir = dirname(inputPath);
  const baseName = basename(inputPath, extname(inputPath));
  const outputDir = options.outDir || dir;
  const outputFileName = `${baseName}${options.extension}`;

  return join(outputDir, outputFileName);
}
