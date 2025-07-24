#!/usr/bin/env bun

import { Command } from "commander";
import * as v from "valibot";
import { ConfigOptionsSchema, parseCLIOptions } from "../domain/cli-options.js";
import { loadConfig } from "../infrastructure/config.js";
import { getPackageName, getVersion } from "../infrastructure/package-info.js";
import { runCommand } from "./command-executor.js";

const program = new Command();

program
  .name(getPackageName())
  .description(
    "Convert .mmd/.mermaid files to Markdown with mermaid code blocks",
  )
  .version(getVersion(), "-v, --version", "display version number")
  .argument(
    "<glob>",
    "file path or glob pattern (e.g., 'file.mmd', '*.mermaid', '**/*.{mmd,mermaid}')",
  )
  .option(
    "-o, --out-dir <dir>",
    "output directory (default: same as input file)",
  )
  .option("--extension <ext>", "output file extension", ".md")
  .option("--header <text>", "header text to prepend")
  .option("--footer <text>", "footer text to append")
  .option("--glob <pattern>", "explicit glob pattern (overrides argument)")
  .option("-c, --config <file>", "config file path")
  .option("--print-config", "print merged configuration and exit")
  .option(
    "--keep-source",
    "keep source .mmd/.mermaid files after conversion",
    false,
  )
  .action(async (globArg: string, cmdOptions: unknown) => {
    try {
      // Parse and validate CLI options
      const validatedOptions = parseCLIOptions(cmdOptions);

      // Run command
      await runCommand(globArg, validatedOptions);
    } catch (error) {
      // Handle errors
      console.error("Error:", error);
      process.exit(1);
    }
  })
  .addHelpText(
    "after",
    `
Examples:
  # Basic usage
  $ ${getPackageName()} diagram.mmd                  # Convert single .mmd file
  $ ${getPackageName()} flowchart.mermaid            # Convert single .mermaid file
  $ ${getPackageName()} "*.mmd"                      # Convert all .mmd files in current directory
  $ ${getPackageName()} "*.mermaid"                  # Convert all .mermaid files
  $ ${getPackageName()} "**/*.{mmd,mermaid}"         # Convert all Mermaid files recursively
  $ ${getPackageName()} "src/**/*.mmd" -o dist/      # Convert with output directory
  $ ${getPackageName()} "*.mermaid" --header "# Docs" # Add header to all files

  # Configuration
  $ ${getPackageName()} --print-config               # Show current configuration
  $ ${getPackageName()} -c myconfig.yaml "*.mermaid" # Use specific config file
  $ ${getPackageName()} validate                     # Validate default config
  $ ${getPackageName()} validate myconfig.json       # Validate specific config

Config file formats: .json, .yaml, .yml, .js, .ts, .cjs, .mjs
Config file names: .mermaid-markdown-wraprc, mermaid-markdown-wrap.config.*

For more options and detailed documentation:
  https://www.npmjs.com/package/${getPackageName()}
`,
  );

// Add validate subcommand
program
  .command("validate [configFile]")
  .description("Validate configuration file without performing any conversion")
  .addHelpText(
    "after",
    `
Examples:
  $ ${getPackageName()} validate                     # Validate config in current directory
  $ ${getPackageName()} validate config.json         # Validate specific JSON config
  $ ${getPackageName()} validate config.yaml         # Validate specific YAML config
  $ ${getPackageName()} validate config.ts           # Validate TypeScript config

The validate command will:
  - Load the configuration file (or search for default config)
  - Check all field types and values
  - Report any validation errors with details
  - Exit with code 0 if valid, 1 if invalid
`,
  )
  .action(async (configFile?: string) => {
    try {
      // Load configuration
      const config = await loadConfig(configFile);

      // Validate using Valibot schema
      const result = v.safeParse(ConfigOptionsSchema, config);

      if (result.success) {
        console.log("✅ Config looks good!");
        process.exit(0);
      } else {
        // Display validation errors
        console.error("❌ Invalid config:");
        for (const issue of result.issues) {
          const path = issue.path?.map((p) => p.key).join(".") || "root";
          console.error(`  - ${path}: ${issue.message}`);
        }
        process.exit(1);
      }
    } catch (error) {
      // Handle file reading or other errors
      console.error(
        "❌ Error loading config:",
        error instanceof Error ? error.message : String(error),
      );
      process.exit(1);
    }
  });

program.parse();
