/**
 * Init config use case
 *
 * This use case handles the initialization of configuration files
 * through an interactive prompt interface.
 */

import { getPackageName } from "../../domain/constants/package-info.js";
import {
  generateConfigFileContent,
  generateConfigFileName,
} from "../../domain/services/config-file-generator.js";
import { fileSystemAdapter } from "../../infrastructure/adapters/file-system.adapter.js";
import {
  runInteractivePrompts,
  showOutro,
  showSpinner,
} from "../../infrastructure/services/interactive-prompts.js";

/**
 * Initialize configuration file through interactive prompts
 */
export async function initConfigUseCase(): Promise<void> {
  try {
    // Run interactive prompts to gather configuration
    const { config, format } = await runInteractivePrompts();

    // Generate file name and content
    const fileName = generateConfigFileName(format);
    const content = generateConfigFileContent(config, format);

    // Show spinner while creating file
    const spinnerInstance = showSpinner(`Creating ${fileName}`);

    try {
      // Write configuration file
      const filePath = fileSystemAdapter.resolvePath(process.cwd(), fileName);

      // Check if file already exists
      try {
        await fileSystemAdapter.readFile(filePath);
        spinnerInstance.stop();

        // Import confirm dynamically to avoid circular dependency
        const { confirm, isCancel, cancel } = await import("@clack/prompts");
        const overwrite = await confirm({
          message: `${fileName} already exists. Do you want to overwrite it?`,
          initialValue: false,
        });

        if (isCancel(overwrite) || !overwrite) {
          cancel("Init cancelled");
          process.exit(0);
        }
      } catch {
        // File doesn't exist, proceed with creation
      }

      await fileSystemAdapter.writeFile(filePath, content);
      spinnerInstance.stop(`✔ Created ${fileName}`);
    } catch (error) {
      spinnerInstance.stopWithError(`✗ Failed to create ${fileName}`);

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
    showOutro(`Next steps:
  npx ${packageName} "src/**/*.mmd"`);
  } catch (error) {
    // If error is due to user cancellation, it's already handled
    if (error instanceof Error && error.message.includes("cancelled")) {
      return;
    }

    // Re-throw other errors
    throw error;
  }
}
