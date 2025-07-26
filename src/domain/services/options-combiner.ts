/**
 * Options combiner service
 *
 * Purpose: Combine raw CLI input with config file options to create final processing options
 *
 * Why needed:
 * - Implements the priority order: CLI > Config > Defaults
 * - Transforms optional raw input into guaranteed processing options
 * - Centralizes the logic for option precedence
 */

import * as v from "valibot";
import type {
  ConfigOptions,
  ProcessingOptions,
  RawCLIOptions,
} from "../models/options.js";
import { ProcessingOptionsSchema } from "../models/options.js";

/**
 * Combine raw CLI options with config file options
 *
 * Priority order:
 * 1. CLI options (what the user explicitly typed)
 * 2. Config file options (from .mermaid-markdown-wraprc.*)
 * 3. Default values (defined in ProcessingOptionsSchema)
 *
 * @param rawCliOptions - Exactly what the user typed on the command line
 * @param configOptions - Options loaded from config file
 * @returns ProcessingOptions with all defaults applied
 */
export function combineOptions(
  rawCliOptions: RawCLIOptions,
  configOptions: ConfigOptions,
): ProcessingOptions {
  // Merge options with correct priority: CLI > Config
  const merged = {
    ...configOptions, // Start with config
    ...rawCliOptions, // Override with CLI (undefined values won't override)
  };

  // Apply defaults using ProcessingOptionsSchema
  // This ensures all required fields have values
  return v.parse(ProcessingOptionsSchema, merged);
}
