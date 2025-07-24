#!/usr/bin/env bun

import { Command } from "commander";
import { parseCLIOptions } from "../domain/cli-options.js";
import { getPackageName, getVersion } from "../infrastructure/package-info.js";
import { runCommand } from "./command-executor.js";

const program = new Command();

program
  .name(getPackageName())
  .description("Convert .mmd files to Markdown with mermaid code blocks")
  .version(getVersion(), "-v, --version", "display version number")
  .argument(
    "<glob>",
    "file path or glob pattern (e.g., 'file.mmd', '*.mmd', '**/*.mmd')",
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
  .option("--keep-source", "keep source .mmd files after conversion", false)
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
  $ ${getPackageName()} diagram.mmd                  # Convert single file
  $ ${getPackageName()} "*.mmd"                      # Convert all .mmd files in current directory
  $ ${getPackageName()} "**/*.mmd"                   # Convert all .mmd files recursively
  $ ${getPackageName()} "src/**/*.mmd" -o dist/      # Convert with output directory
  $ ${getPackageName()} "*.mmd" --header "# Docs"    # Add header to all files

For more options and detailed documentation:
  https://www.npmjs.com/package/${getPackageName()}
`,
  );

program.parse();
