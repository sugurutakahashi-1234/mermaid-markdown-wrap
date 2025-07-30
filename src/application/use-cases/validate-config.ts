import type { ConfigOptions } from "../../domain/models/options.js";
import { loadConfigurationFile } from "../../infrastructure/adapters/cosmiconfig.adapter.js";

/**
 * Validation result for configuration
 */
interface ConfigValidationResult {
  success: boolean;
  config?: ConfigOptions;
  errors?: Array<{ path: string; message: string }>;
}

/**
 * Validate configuration use case
 * Loads configuration file and returns structured validation result
 *
 * Note: Actual validation is performed by loadConfigurationFile.
 * This function only structures the result for UI consumption.
 */
export async function validateConfigUseCase(
  configFile?: string,
): Promise<ConfigValidationResult> {
  try {
    // Load and validate configuration
    const config = await loadConfigurationFile(configFile);

    // Configuration is already validated by loadConfigurationFile
    return {
      success: true,
      config,
    };
  } catch (error) {
    // Structure the error for UI display
    return {
      success: false,
      errors: [
        {
          path: "root",
          message: error instanceof Error ? error.message : String(error),
        },
      ],
    };
  }
}
