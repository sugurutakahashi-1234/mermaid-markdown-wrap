#!/usr/bin/env bun

import { Command } from "commander";
import { convertFilesUseCase } from "../application/use-cases/convert-files.js";
import { showConfigUseCase } from "../application/use-cases/show-config.js";
import { validateConfigUseCase } from "../application/use-cases/validate-config.js";
import {
  getPackageName,
  getVersion,
} from "../domain/constants/package-info.js";
import { NoFilesFoundError } from "../domain/models/errors.js";

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
  // Basic output settings
  .option(
    "-o, --out-dir <dir>",
    "output directory (default: same as input file)",
  )
  .option("--extension <ext>", "output file extension", ".md")
  // Content modification
  .option("--header <text>", "header text to prepend")
  .option("--footer <text>", "footer text to append")
  // Advanced input settings
  .option("--glob <pattern>", "explicit glob pattern (overrides argument)")
  // Configuration file settings
  .option("-c, --config <file>", "config file path")
  // Behavior control
  .option(
    "--keep-source",
    "keep source .mmd/.mermaid files after conversion",
    false,
  )
  .option("--no-show-command", "disable showing the command used in the output")
  .action(async (globArg: string, cmdOptions: unknown) => {
    try {
      // Execute the file conversion use case (validation happens inside)
      const { results } = await convertFilesUseCase(globArg, cmdOptions);

      // Print results
      const failureCount = results.filter((r) => !r.success).length;

      console.log(`Converting ${results.length} file(s)...`);

      for (const result of results) {
        if (result.success) {
          console.log(`✓ ${result.filePath}`);
        } else {
          console.error(`✗ ${result.filePath}: ${result.error?.message}`);
        }
      }

      if (failureCount === 0) {
        console.log("Done!");
      } else {
        console.error(`\nCompleted with ${failureCount} error(s)`);
      }

      // Exit with error code if there were failures
      if (results.some((r) => !r.success)) {
        process.exit(1);
      }
    } catch (error) {
      // Handle specific errors
      if (error instanceof NoFilesFoundError) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
      }

      // Handle other errors
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
  $ ${getPackageName()} -c myconfig.yaml "*.mermaid" # Use specific config file
  $ ${getPackageName()} config-show                  # Show current configuration
  $ ${getPackageName()} config-show custom.yaml       # Show config from specific file
  $ ${getPackageName()} config-validate              # Validate config files
  $ ${getPackageName()} config-validate custom.json   # Validate specific file

Config file search order (auto-discovery):
  1. .${getPackageName()}rc (no extension)
  2. .${getPackageName()}rc.{json,yaml,yml,js,ts,mjs,cjs}
  3. ${getPackageName()}.config.{js,ts,mjs,cjs}
  4. .config/${getPackageName()}rc.* (in .config subdirectory)
  5. "${getPackageName()}" property in package.json

Use -c option to specify any custom config file path.
Note: CLI arguments take precedence over config file settings.

For more options and detailed documentation:
  https://www.npmjs.com/package/${getPackageName()}
`,
  );

// Add config-show subcommand
program
  .command("config-show [configFile]")
  .description("Show current configuration (merged from all sources)")
  .addHelpText(
    "after",
    `
Examples:
  $ ${getPackageName()} config-show                        # Show config from default locations
  $ ${getPackageName()} config-show myconfig.json          # Show config from specific JSON file
  $ ${getPackageName()} config-show myconfig.yaml          # Show config from specific YAML file
  $ ${getPackageName()} config-show myconfig.ts            # Show config from TypeScript file

Without arguments: searches for config files in default locations
With argument: loads the specified file directly

The config-show command will:
  - Load configuration from file or auto-discovered locations
  - Merge with default values
  - Output the final configuration as JSON
  - Useful for debugging config file issues
`,
  )
  .action(async (configFile?: string) => {
    try {
      // Use the show config use case
      const mergedOptions = await showConfigUseCase(configFile);

      // Print merged configuration
      console.log("✅ Current configuration:");
      console.log(JSON.stringify(mergedOptions, null, 2));
    } catch (error) {
      console.error(
        "❌ Error loading config:",
        error instanceof Error ? error.message : String(error),
      );
      process.exit(1);
    }
  });

// Add config-validate subcommand
program
  .command("config-validate [configFile]")
  .description("Validate configuration file")
  .addHelpText(
    "after",
    `
Examples:
  $ ${getPackageName()} config-validate                     # Validate config in current directory
  $ ${getPackageName()} config-validate myconfig.json       # Validate specific config file
  $ ${getPackageName()} config-validate myconfig.yaml       # Validate specific YAML config
  $ ${getPackageName()} config-validate myconfig.ts         # Validate TypeScript config

Without arguments: searches for config files in default locations
With argument: validates the specified file directly

The config-validate command will:
  - Check all field types and values
  - Report any validation errors with details
  - Exit with code 0 if valid, 1 if invalid
`,
  )
  .action(async (configFile?: string) => {
    try {
      // Use the validate config use case
      const result = await validateConfigUseCase(configFile);

      if (result.success) {
        console.log("✅ Config looks good!");
        process.exit(0);
      } else {
        // Display validation errors
        console.error("❌ Invalid config:");
        for (const error of result.errors || []) {
          console.error(`  - ${error.path}: ${error.message}`);
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

program.parse(process.argv);
