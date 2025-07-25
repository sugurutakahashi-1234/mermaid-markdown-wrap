/**
 * Cosmiconfig adapter
 *
 * This adapter provides a thin wrapper around the cosmiconfig library
 * for loading configuration files in various formats.
 */

import { cosmiconfig } from "cosmiconfig";
import { TypeScriptLoader } from "cosmiconfig-typescript-loader";
import { getPackageName } from "../../domain/constants/package-info.js";
import type { ConfigOptions } from "../../domain/models/options.js";

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

    return configResult?.config || {};
  } catch (error) {
    // If a specific config file was requested but failed to load, throw the error
    if (configPath && error instanceof Error) {
      throw error;
    }
    // If auto-searching for config and none found, return empty config
    return {};
  }
}
