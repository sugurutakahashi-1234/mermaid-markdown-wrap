/**
 * Options merger service
 *
 * This service implements the business rule for merging options
 * from different sources with the correct priority order.
 */

import type { CLIOptions, ConfigOptions, Options } from "../models/options.js";
import { DEFAULT_OPTIONS } from "../models/options.js";

/**
 * Merge options from CLI, config file, and defaults
 *
 * Business rule: Priority order is CLI > Config > Defaults
 * This ensures that users can always override settings from the command line.
 */
export function mergeOptions(
  cliOptions: CLIOptions,
  configOptions: ConfigOptions,
): Options {
  return {
    // Required options with defaults
    extension:
      cliOptions.extension ??
      configOptions.extension ??
      DEFAULT_OPTIONS.extension,
    header: cliOptions.header ?? configOptions.header ?? DEFAULT_OPTIONS.header,
    footer: cliOptions.footer ?? configOptions.footer ?? DEFAULT_OPTIONS.footer,
    keepSource:
      cliOptions.keepSource ??
      configOptions.keepSource ??
      DEFAULT_OPTIONS.keepSource,
    showCommand:
      cliOptions.showCommand ??
      configOptions.showCommand ??
      DEFAULT_OPTIONS.showCommand,

    // Optional options
    ...((cliOptions.outDir ?? configOptions.outDir)
      ? { outDir: cliOptions.outDir ?? configOptions.outDir }
      : {}),

    // CLI-only options
    ...(cliOptions.config ? { config: cliOptions.config } : {}),
  };
}
