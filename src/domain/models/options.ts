import * as v from "valibot";

/**
 * Base schema for configuration options (from config file)
 */
export const ConfigOptionsSchema = v.object({
  outDir: v.optional(v.string()),
  extension: v.optional(v.string()),
  header: v.optional(v.string()),
  footer: v.optional(v.string()),
  keepSource: v.optional(v.boolean()),
  showCommand: v.optional(v.boolean()),
});

/**
 * CLI-specific options that are not in config files
 */
const CLISpecificOptionsSchema = v.object({
  config: v.optional(v.string()),
});

/**
 * Combined CLI options schema (includes config options)
 */
export const CLIOptionsSchema = v.object({
  ...ConfigOptionsSchema.entries,
  ...CLISpecificOptionsSchema.entries,
});

/**
 * Complete options schema with required fields
 */
const OptionsSchema = v.object({
  extension: v.string(),
  header: v.string(),
  footer: v.string(),
  keepSource: v.boolean(),
  showCommand: v.boolean(),
  outDir: v.optional(v.string()),
  config: v.optional(v.string()),
});

// Type exports
export type ConfigOptions = v.InferOutput<typeof ConfigOptionsSchema>;
export type CLIOptions = v.InferOutput<typeof CLIOptionsSchema>;
export type Options = v.InferOutput<typeof OptionsSchema>;

/**
 * Default options
 */
export const DEFAULT_OPTIONS: Required<
  Pick<
    Options,
    "extension" | "header" | "footer" | "keepSource" | "showCommand"
  >
> = {
  extension: ".md",
  header: "",
  footer: "",
  keepSource: false,
  showCommand: true,
} as const;
