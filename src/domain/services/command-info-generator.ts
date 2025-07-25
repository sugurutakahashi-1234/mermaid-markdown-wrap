/**
 * Command info generation service
 *
 * Generates a bash command string that shows how the tool was invoked,
 * similar to how tsg (TypeScript Graph) displays the command used to generate its output.
 */

import { getPackageName } from "../constants/package-info.js";
import type { CLIOptions } from "../models/options.js";

/**
 * Generate command info string from CLI options and glob pattern
 *
 * Reconstructs the command that was used to invoke the tool,
 * including all specified options.
 */
export function generateCommandInfo(
  globPattern: string,
  cliOptions: CLIOptions,
): string {
  const parts: string[] = [getPackageName()];

  // Add glob pattern with quotes if it contains special characters
  if (globPattern.includes(" ") || globPattern.includes("*")) {
    parts.push(`"${globPattern}"`);
  } else {
    parts.push(globPattern);
  }

  // Add options in a consistent order
  if (cliOptions.outDir) {
    parts.push("--out-dir", cliOptions.outDir);
  }

  if (cliOptions.header) {
    parts.push("--header", `"${cliOptions.header}"`);
  }

  if (cliOptions.footer) {
    parts.push("--footer", `"${cliOptions.footer}"`);
  }

  if (cliOptions.config) {
    parts.push("--config", cliOptions.config);
  }

  if (cliOptions.keepSource === true) {
    parts.push("--keep-source");
  }

  // Note: we don't include --no-show-command since that would be redundant
  // when the command is being shown

  return parts.join(" ");
}
