import * as v from "valibot";

// Output format constants
export const OUTPUT_FORMATS = ["text", "json"] as const;

/**
 * Configuration file options
 */
export const ConfigOptionsSchema = v.object({
  outDir: v.optional(v.string()),
  header: v.optional(v.string()),
  footer: v.optional(v.string()),
  removeSource: v.optional(v.boolean()),
  showCommand: v.optional(v.boolean()),
});

/**
 * CLI options (includes all possible options from command line)
 */
export const CLIOptionsSchema = v.object({
  // Config file options
  outDir: v.optional(v.string()),
  header: v.optional(v.string()),
  footer: v.optional(v.string()),
  removeSource: v.optional(v.boolean()),
  showCommand: v.optional(v.boolean()),
  // CLI-only options
  config: v.optional(v.string()),
  logFormat: v.optional(v.picklist(OUTPUT_FORMATS, "Invalid log format")),
  quiet: v.optional(v.boolean()),
});

/**
 * Merged options with all required fields
 */
const MergedOptionsSchema = v.object({
  header: v.string(),
  footer: v.string(),
  removeSource: v.boolean(),
  showCommand: v.boolean(),
  outDir: v.optional(v.string()),
  // Note: config, format, and quiet are not included in merged options
});

// Type exports
export type ConfigOptions = v.InferOutput<typeof ConfigOptionsSchema>;
export type CLIOptions = v.InferOutput<typeof CLIOptionsSchema>;
export type MergedOptions = v.InferOutput<typeof MergedOptionsSchema>;

/**
 * Default option values
 */
export const DEFAULT_OPTIONS: MergedOptions = {
  header: "",
  footer: "",
  removeSource: false,
  showCommand: true,
} as const;
