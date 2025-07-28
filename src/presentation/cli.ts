#!/usr/bin/env bun

import { Command } from "commander";
import { convertFilesUseCase } from "../application/use-cases/convert-files.js";
import { initConfigUseCase } from "../application/use-cases/init-config.js";
import { loadAndCombineConfigUseCase } from "../application/use-cases/load-and-combine-config.js";
import { showConfigUseCase } from "../application/use-cases/show-config.js";
import { validateConfigUseCase } from "../application/use-cases/validate-config.js";
import {
  getPackageName,
  getVersion,
} from "../domain/constants/package-info.js";
import { UserCancelledError } from "../domain/models/errors.js";

const program = new Command();

program
  .name(getPackageName())
  .description(
    "Convert .mmd/.mermaid files to Markdown with mermaid code blocks",
  )
  .version(getVersion(), "-v, --version", "display version number")
  .argument(
    "<input>",
    "file path or glob pattern (e.g., 'file.mmd', '*.mermaid', '**/*.{mmd,mermaid}')",
  )
  // Basic output settings
  .option(
    "-o, --out-dir <dir>",
    "output directory (default: same as input file)",
  )
  // Content modification
  .option("--header <text>", "header text to prepend")
  .option("--footer <text>", "footer text to append")
  // Behavior control
  .option(
    "--remove-source",
    "remove source .mmd/.mermaid files after conversion",
    false,
  )
  .option("--hide-command", "hide generation command in output files", false)
  .option("--log-format <format>", "log output format: text or json", "text")
  .option("--quiet", "suppress non-error output", false)
  // Configuration file settings
  .option("-c, --config <file>", "config file path")
  .action(async (globArg: string, cmdOptions: unknown) => {
    try {
      // Load configuration and combine with CLI options
      const { rawCliOptions, processingOptions } =
        await loadAndCombineConfigUseCase(cmdOptions);

      // Execute the file conversion use case with processing options
      const result = await convertFilesUseCase(
        globArg,
        processingOptions,
        rawCliOptions,
      );

      // Use processing options for output formatting
      const isJson = processingOptions.logFormat === "json";
      const quiet = processingOptions.quiet;

      if (isJson) {
        // Output as JSON
        console.log(JSON.stringify(result, null, 2));
      } else {
        // Output as text
        if (!quiet) {
          // Display file conversions
          result.conversions.forEach((conversion) => {
            if (conversion.converted) {
              console.log(
                `✅ ${conversion.mermaidFile} -> ${conversion.markdownFile}`,
              );
            } else {
              console.error(
                `❌ ${conversion.mermaidFile}: ${conversion.failureReason || "Unknown error"}`,
              );
            }
          });

          // Display summary for multiple files
          if (result.summary.totalMermaidFiles > 1) {
            const summaryIcon =
              result.summary.failedConversions > 0 ? "⚠️" : "✅";
            console.log(
              `\n${summaryIcon} ${result.summary.totalMermaidFiles} files converted (${result.summary.successfulConversions} success, ${result.summary.failedConversions} failed)`,
            );
          }
        } else {
          // In quiet mode, only show errors
          result.conversions.forEach((conversion) => {
            if (!conversion.converted) {
              console.error(
                `❌ ${conversion.mermaidFile}: ${conversion.failureReason || "Unknown error"}`,
              );
            }
          });
        }
      }

      // Exit with error code if there were failures
      process.exit(result.summary.failedConversions > 0 ? 1 : 0);
    } catch (error) {
      if (error instanceof UserCancelledError) {
        process.exit(0);
      }
      const message = error instanceof Error ? error.message : String(error);
      console.error(`❌ Error: ${message}`);
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
  $ ${getPackageName()} init                         # Create a configuration file interactively
  $ ${getPackageName()} init -y                       # Create config with default settings
  $ ${getPackageName()} -c myconfig.yaml "*.mermaid" # Use specific config file
  $ ${getPackageName()} "*.mmd" --remove-source      # Convert and remove source files
  $ ${getPackageName()} config-show                  # Show current configuration
  $ ${getPackageName()} config-show custom.yaml       # Show config from specific file
  $ ${getPackageName()} config-validate              # Validate config files
  $ ${getPackageName()} config-validate custom.json   # Validate specific file

Config file search locations (powered by cosmiconfig):
  - package.json ("${getPackageName()}" property)
  - .${getPackageName()}rc (no extension)
  - .${getPackageName()}rc.{json,yaml,yml,js,ts,mjs,cjs}
  - .config/${getPackageName()}rc (no extension)
  - .config/${getPackageName()}rc.{json,yaml,yml,js,ts,mjs,cjs}
  - ${getPackageName()}.config.{js,ts,mjs,cjs}

Use -c option to specify any custom config file path.
Note: CLI arguments take precedence over config file settings.

For more options and detailed documentation:
  https://www.npmjs.com/package/${getPackageName()}
`,
  );

// Add init subcommand
program
  .command("init")
  .description("Interactive wizard to create a configuration file")
  .option("-y, --yes", "skip prompts and use default settings", false)
  .addHelpText(
    "after",
    `
Examples:
  $ ${getPackageName()} init                              # Start interactive configuration
  $ ${getPackageName()} init --yes                        # Create config with default settings
  $ ${getPackageName()} init -y                           # Create config with default settings (shorthand)

The init command will guide you through creating a configuration file by asking about:
  - Config file format (TypeScript, JavaScript, JSON, YAML, etc.)
  - Output directory
  - Header/footer text
  - Whether to remove source files
  - Whether to include generation command in output

With --yes option, it will create a TypeScript config file with all default values.
`,
  )
  .action(async (options: { yes: boolean }) => {
    try {
      await initConfigUseCase(options.yes);
    } catch (error) {
      if (error instanceof UserCancelledError) {
        process.exit(0);
      }
      const message = error instanceof Error ? error.message : String(error);
      console.error(`❌ Error: ${message}`);
      process.exit(1);
    }
  });

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
