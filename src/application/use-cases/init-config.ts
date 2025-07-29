/**
 * Init config use case
 *
 * This use case handles the initialization of configuration files
 * through an interactive prompt interface.
 */

import { getPackageName } from "../../domain/constants/package-info.js";
import type { ConfigOptions } from "../../domain/models/options.js";
import {
  type ConfigFormat,
  generateConfigFileContent,
  generateConfigFileName,
} from "../../domain/services/config-file-generator.js";
import { fileSystemAdapter } from "../../infrastructure/adapters/file-system.adapter.js";
import {
  confirmOverwrite,
  runInteractivePrompts,
  showOutro,
  showSpinner,
} from "../../infrastructure/services/interactive-prompts.js";

/**
 * Initialize configuration file through interactive prompts
 * @param skipPrompts - Skip interactive prompts and use default settings
 */
export async function initConfigUseCase(
  skipPrompts: boolean = false,
): Promise<void> {
  let config: ConfigOptions;
  let format: ConfigFormat;

  if (skipPrompts) {
    // Use default settings when skipPrompts is true
    config = {}; // Empty config means all defaults
    format = "json"; // Default to JSON format
  } else {
    // Run interactive prompts to gather configuration
    const promptResult = await runInteractivePrompts();
    config = promptResult.config;
    format = promptResult.format;
  }

  // Generate file name and content
  const fileName = generateConfigFileName(format);
  const content = generateConfigFileContent(config, format);
  const filePath = fileSystemAdapter.resolvePath(process.cwd(), fileName);

  // Check if file already exists
  let fileExists = false;
  try {
    await fileSystemAdapter.readFile(filePath);
    fileExists = true;
  } catch {
    // File doesn't exist, proceed with creation
  }

  if (fileExists && !skipPrompts) {
    const overwrite = await confirmOverwrite(fileName);
    if (!overwrite) {
      return; // User chose not to overwrite
    }
  }

  // Show spinner while creating file
  const spinnerInstance = skipPrompts
    ? null
    : showSpinner(`Creating ${fileName}`);

  try {
    await fileSystemAdapter.writeFile(filePath, content);
    if (spinnerInstance) {
      spinnerInstance.stop(`✔ Created ${fileName}`);
    } else {
      console.log(`✔ Created ${fileName}`);
    }
  } catch (error) {
    if (spinnerInstance) {
      spinnerInstance.stopWithError(`✗ Failed to create ${fileName}`);
    } else {
      console.error(`✗ Failed to create ${fileName}`);
    }

    // Provide more specific error message for permission errors
    if (error instanceof Error && error.message.includes("EACCES")) {
      throw new Error(
        `Permission denied: Cannot write to ${fileName}. Please check write permissions in the current directory.`,
      );
    }
    throw error;
  }

  // Show next steps
  const packageName = getPackageName();
  if (skipPrompts) {
    console.log(`Next steps:
  npx ${packageName} "src/**/*.mmd"`);
  } else {
    showOutro(`Next steps:
  npx ${packageName} "src/**/*.mmd"`);
  }
}
