/**
 * Interactive prompts service
 *
 * This service provides interactive command-line prompts
 * for gathering user input during the init process.
 */

import {
  cancel,
  confirm,
  group,
  intro,
  isCancel,
  outro,
  select,
  spinner,
  text,
} from "@clack/prompts";
import { getPackageName } from "../../domain/constants/package-info.js";
import { UserCancelledError } from "../../domain/models/errors.js";
import type { ConfigOptions } from "../../domain/models/options.js";
import {
  CONFIG_FORMATS,
  type ConfigFormat,
} from "../../domain/services/config-file-generator.js";

/**
 * Result of the interactive prompts
 */
export interface PromptResult {
  config: ConfigOptions;
  format: ConfigFormat;
}

/**
 * Run interactive prompts to gather configuration
 */
export async function runInteractivePrompts(): Promise<PromptResult> {
  intro(`🧙 ${getPackageName()} init`);

  // Use group to collect all prompts at once
  const result = await group(
    {
      format: () =>
        select({
          message: "Choose a config file format",
          options: CONFIG_FORMATS.map((fmt) => ({
            label: fmt.label,
            value: fmt.value,
          })),
          initialValue: "ts" as ConfigFormat,
        }),
      outDir: () =>
        text({
          message: "Output directory (leave empty for same as input)",
          placeholder: "docs",
        }),
      header: () =>
        text({
          message: "Header text to prepend to each converted file",
          placeholder: "<!-- AUTO-GENERATED -->",
          initialValue: "",
        }),
      footer: () =>
        text({
          message: "Footer text to append to each converted file",
          placeholder: "<!-- END -->",
          initialValue: "",
        }),
      removeSource: () =>
        confirm({
          message: "Remove original .mmd files after conversion?",
          initialValue: false,
        }),
      hideCommand: () =>
        confirm({
          message: "Hide the generation command in output files?",
          initialValue: false,
        }),
      logFormat: () =>
        select({
          message: "Log output format",
          options: [
            { label: "Text (human-readable)", value: "text" },
            { label: "JSON (machine-readable)", value: "json" },
          ],
          initialValue: "text" as const,
        }),
      quiet: () =>
        confirm({
          message: "Suppress non-error output?",
          initialValue: false,
        }),
    },
    {
      // On cancel callback
      onCancel: () => {
        cancel("Init cancelled");
        throw new UserCancelledError("Init cancelled");
      },
    },
  );

  // Build configuration object
  const config: ConfigOptions = {};

  // Only add non-default values to keep config minimal
  if (result.outDir && String(result.outDir).trim()) {
    config.outDir = String(result.outDir).trim();
  }
  if (result.header !== "") {
    config.header = String(result.header);
  }
  if (result.footer !== "") {
    config.footer = String(result.footer);
  }
  if (result.removeSource !== false) {
    config.removeSource = Boolean(result.removeSource);
  }
  if (result.hideCommand !== false) {
    config.hideCommand = Boolean(result.hideCommand);
  }
  if (result.logFormat !== "text") {
    config.logFormat = result.logFormat as "text" | "json";
  }
  if (result.quiet !== false) {
    config.quiet = Boolean(result.quiet);
  }

  return {
    config,
    format: result.format as ConfigFormat,
  };
}

/**
 * Show a spinner while performing an operation
 */
export function showSpinner(message: string): {
  stop: (message?: string) => void;
  stopWithError: (message: string) => void;
} {
  const s = spinner();
  s.start(message);

  return {
    stop: (message?: string) => {
      s.stop(message || "Done");
    },
    stopWithError: (message: string) => {
      s.stop(message);
    },
  };
}

/**
 * Confirm file overwrite
 */
export async function confirmOverwrite(fileName: string): Promise<boolean> {
  const result = await confirm({
    message: `${fileName} already exists. Do you want to overwrite it?`,
    initialValue: false,
  });

  if (isCancel(result)) {
    throw new UserCancelledError("Init cancelled - file overwrite declined");
  }

  return result;
}

/**
 * Export utilities for use in other modules
 */
export { isCancel };

/**
 * Show outro message
 */
export function showOutro(message: string): void {
  outro(message);
}
