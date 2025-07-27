/**
 * Command info generation service
 *
 * Generates a bash command string that shows how the tool was invoked,
 * similar to how tsg (TypeScript Graph) displays the command used to generate its output.
 */

import { getPackageName } from "../constants/package-info.js";
import type { RawCLIOptions } from "../models/options.js";

/**
 * Generate command info string from raw CLI options and glob pattern
 *
 * Purpose: Reconstruct the exact command the user typed
 *
 * Why this uses RawCLIOptions:
 * - Shows only the options the user explicitly provided
 * - Doesn't include default values the user didn't set
 * - Maintains accuracy of the displayed command
 */
export function generateCommandInfo(
  globPattern: string,
  rawCliOptions: RawCLIOptions,
): string {
  const parts: string[] = [getPackageName()];

  // Add glob pattern with quotes if it contains special characters
  if (globPattern.includes(" ") || globPattern.includes("*")) {
    parts.push(`"${globPattern}"`);
  } else {
    parts.push(globPattern);
  }

  // Add options in a consistent order
  if (rawCliOptions.outDir) {
    parts.push("--out-dir", rawCliOptions.outDir);
  }

  if (rawCliOptions.header) {
    parts.push("--header", `"${rawCliOptions.header}"`);
  }

  if (rawCliOptions.footer) {
    parts.push("--footer", `"${rawCliOptions.footer}"`);
  }

  if (rawCliOptions.config) {
    parts.push("--config", rawCliOptions.config);
  }

  if (rawCliOptions.removeSource === true) {
    parts.push("--remove-source");
  }

  if (rawCliOptions.logFormat && rawCliOptions.logFormat !== "text") {
    parts.push("--log-format", rawCliOptions.logFormat);
  }

  if (rawCliOptions.quiet === true) {
    parts.push("--quiet");
  }

  // Note: we don't include --hide-command since that would be redundant
  // when the command is being shown

  return parts.join(" ");
}
