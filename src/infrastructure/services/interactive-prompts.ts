/**
 * Interactive prompts service
 *
 * This service provides interactive command-line prompts
 * for gathering user input during the init process.
 */

import {
  cancel,
  confirm,
  intro,
  isCancel,
  outro,
  select,
  spinner,
  text,
} from "@clack/prompts";
import { getPackageName } from "../../domain/constants/package-info.js";
import {
  type ConfigOptions,
  DEFAULT_OPTIONS,
} from "../../domain/models/options.js";
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

  // Select configuration file format
  const format = await select({
    message: "Choose a config file format",
    options: CONFIG_FORMATS.map((fmt) => ({
      label: fmt.label,
      value: fmt.value,
    })),
    initialValue: "ts" as ConfigFormat,
  });

  if (isCancel(format)) {
    cancel("Init cancelled");
    process.exit(0);
  }

  // Get output directory
  const outDir = await text({
    message: "Output directory (leave empty for same as input)",
    placeholder: "docs",
  });

  if (isCancel(outDir)) {
    cancel("Init cancelled");
    process.exit(0);
  }

  // Get header text
  const header = await text({
    message: "Header text to prepend",
    placeholder: "<!-- AUTO-GENERATED -->",
    initialValue: DEFAULT_OPTIONS.header,
  });

  if (isCancel(header)) {
    cancel("Init cancelled");
    process.exit(0);
  }

  // Get footer text
  const footer = await text({
    message: "Footer text to append",
    placeholder: "<!-- END -->",
    initialValue: DEFAULT_OPTIONS.footer,
  });

  if (isCancel(footer)) {
    cancel("Init cancelled");
    process.exit(0);
  }

  // Ask about keeping source files
  const keepSource = await confirm({
    message: "Keep original .mmd files after conversion?",
    initialValue: DEFAULT_OPTIONS.keepSource,
  });

  if (isCancel(keepSource)) {
    cancel("Init cancelled");
    process.exit(0);
  }

  // Ask about showing command in output
  const showCommand = await confirm({
    message: "Include the generation command in output files?",
    initialValue: DEFAULT_OPTIONS.showCommand,
  });

  if (isCancel(showCommand)) {
    cancel("Init cancelled");
    process.exit(0);
  }

  // Build configuration object
  const config: ConfigOptions = {};

  // Only add non-default values to keep config minimal
  if (outDir && String(outDir).trim()) {
    config.outDir = String(outDir).trim();
  }
  if (header !== DEFAULT_OPTIONS.header) {
    config.header = String(header);
  }
  if (footer !== DEFAULT_OPTIONS.footer) {
    config.footer = String(footer);
  }
  if (keepSource !== DEFAULT_OPTIONS.keepSource) {
    config.keepSource = Boolean(keepSource);
  }
  if (showCommand !== DEFAULT_OPTIONS.showCommand) {
    config.showCommand = Boolean(showCommand);
  }

  return {
    config,
    format: format as ConfigFormat,
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
 * Show outro message
 */
export function showOutro(message: string): void {
  outro(message);
}
