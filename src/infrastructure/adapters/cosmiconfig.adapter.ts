/**
 * Cosmiconfig adapter
 *
 * This adapter provides a thin wrapper around the cosmiconfig library
 * for loading configuration files in various formats.
 */

import { cosmiconfig } from "cosmiconfig";
import { TypeScriptLoader } from "cosmiconfig-typescript-loader";
import * as v from "valibot";
import { getPackageName } from "../../domain/constants/package-info.js";
import type { ConfigOptions } from "../../domain/models/options.js";
import { ConfigOptionsSchema } from "../../domain/models/options.js";

/**
 * Load configuration from file using cosmiconfig
 *
 * Searches for configuration in the following places (cosmiconfig defaults):
 * - package.json ("mermaid-markdown-wrap" property)
 * - .mermaid-markdown-wraprc (no extension)
 * - .mermaid-markdown-wraprc.{json,yaml,yml,js,ts,mjs,cjs}
 * - .config/mermaid-markdown-wraprc (no extension)
 * - .config/mermaid-markdown-wraprc.{json,yaml,yml,js,ts,mjs,cjs}
 * - mermaid-markdown-wrap.config.{js,ts,mjs,cjs}
 *
 * @param configPath - Optional path to a specific config file
 * @returns Validated configuration object or empty object if none found
 * @throws Error if specified config file is invalid (only when configPath is provided)
 */
export async function loadConfigurationFile(
  configPath?: string,
): Promise<ConfigOptions> {
  const explorer = cosmiconfig(getPackageName(), {
    loaders: {
      ".ts": TypeScriptLoader(),
    },
  });

  try {
    const configResult = configPath
      ? await explorer.load(configPath)
      : await explorer.search();

    // If no config found, return empty object
    if (!configResult) {
      return {};
    }

    // Validate the configuration
    const result = v.safeParse(ConfigOptionsSchema, configResult.config);

    if (!result.success) {
      // Create a simple error message
      const firstError = result.issues[0];
      const message = firstError
        ? `Invalid configuration: ${firstError.message}`
        : "Invalid configuration";
      throw new Error(message);
    }

    return result.output;
  } catch (error) {
    // Behavior differs based on whether a config file was explicitly specified:
    // - With configPath: User expects this file to work, so throw errors
    // - Without configPath: Config is optional, so silently fall back to defaults
    if (configPath && error instanceof Error) {
      throw error;
    }
    return {};
  }
}
