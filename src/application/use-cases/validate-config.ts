import * as v from "valibot";
import type { ConfigOptions } from "../../domain/models/options.js";
import { ConfigOptionsSchema } from "../../domain/models/options.js";
import { loadConfigurationFile } from "../../infrastructure/adapters/cosmiconfig.adapter.js";

/**
 * Validation result for configuration
 */
export interface ConfigValidationResult {
  success: boolean;
  config?: ConfigOptions;
  errors?: Array<{ path: string; message: string }>;
}

/**
 * Validate configuration use case
 * Loads and validates configuration file
 */
export async function validateConfigUseCase(
  configFile?: string,
): Promise<ConfigValidationResult> {
  // Load configuration
  const config = await loadConfigurationFile(configFile);

  // Validate using Valibot schema
  const result = v.safeParse(ConfigOptionsSchema, config);

  if (result.success) {
    return {
      success: true,
      config: result.output,
    };
  }

  // Transform validation errors
  const errors = result.issues.map((issue) => ({
    path: issue.path?.map((p) => p.key).join(".") || "root",
    message: issue.message,
  }));

  return {
    success: false,
    errors,
  };
}
