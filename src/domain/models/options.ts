import * as v from "valibot";

// Output format constants
const OUTPUT_FORMATS = ["text", "json"] as const;

/**
 * Configuration file options schema
 *
 * Purpose: Parse and validate options from configuration files (.mermaid-markdown-wraprc.*)
 *
 * Why needed:
 * - Users can define default settings in a config file
 * - Config files should only contain options that affect processing
 * - All fields are optional since config files may only override specific values
 */
export const ConfigOptionsSchema = v.object({
  outDir: v.optional(v.string()),
  header: v.optional(v.string()),
  footer: v.optional(v.string()),
  removeSource: v.optional(v.boolean()),
  hideCommand: v.optional(v.boolean()),
  logFormat: v.optional(v.picklist(OUTPUT_FORMATS, "Invalid log format")),
  quiet: v.optional(v.boolean()),
});

/**
 * Raw CLI options schema
 *
 * Purpose: Capture exactly what the user typed on the command line
 *
 * Why needed:
 * - The hideCommand feature controls whether to hide the command the user ran
 * - We shouldn't show default values that the user didn't explicitly set
 * - Example: If user runs "mermaid-markdown-wrap *.mmd --header 'Title'",
 *   the command shown should be exactly that, not include default values
 *
 * All fields are optional because users may not specify them
 */
export const RawCLIOptionsSchema = v.object({
  // Config file options that can also be set via CLI
  outDir: v.optional(v.string()),
  header: v.optional(v.string()),
  footer: v.optional(v.string()),
  removeSource: v.optional(v.boolean()),
  hideCommand: v.optional(v.boolean()),
  logFormat: v.optional(v.picklist(OUTPUT_FORMATS, "Invalid log format")),
  quiet: v.optional(v.boolean()),
  // CLI-only options
  config: v.optional(v.string()), // Path to configuration file
});

/**
 * Processing options schema with defaults
 *
 * Purpose: The final options used for all CLI operations with all defaults applied
 *
 * Why needed:
 * - Processing functions need guaranteed values (no undefined checks)
 * - Central place to manage all default values
 * - Type safety: TypeScript knows these fields are never undefined
 *
 * Uses v.optional with default values to ensure all required fields have values
 */
export const ProcessingOptionsSchema = v.object({
  // Output directory (optional - if not set, files are created next to source)
  outDir: v.optional(v.string()),
  // Header/footer text with empty string defaults
  header: v.optional(v.string(), ""),
  footer: v.optional(v.string(), ""),
  // Behavioral flags with sensible defaults
  removeSource: v.optional(v.boolean(), false), // Keep source files by default
  hideCommand: v.optional(v.boolean(), false), // Don't hide command by default
  // CLI output control options
  logFormat: v.optional(v.picklist(OUTPUT_FORMATS), "text"), // Default to text output
  quiet: v.optional(v.boolean(), false), // Show output by default
  // Note: config path is not included as it's only used for loading
});

// Type exports
export type ConfigOptions = v.InferOutput<typeof ConfigOptionsSchema>;
export type RawCLIOptions = v.InferOutput<typeof RawCLIOptionsSchema>;
export type ProcessingOptions = v.InferOutput<typeof ProcessingOptionsSchema>;
