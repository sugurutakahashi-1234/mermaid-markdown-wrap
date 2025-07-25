import type { ConfigOptions } from "../../domain/cli-options.js";
import { DEFAULT_OPTIONS } from "../../domain/cli-options.js";
import { loadConfig } from "../../infrastructure/config.js";

/**
 * Show configuration use case
 * Loads and merges configuration for display
 */
export async function showConfigUseCase(
  configFile?: string,
): Promise<ConfigOptions> {
  // Load configuration
  const config = await loadConfig(configFile);

  // Merge options (without requiring glob)
  const mergedOptions: ConfigOptions = {
    extension: config.extension ?? DEFAULT_OPTIONS.extension,
    header: config.header ?? DEFAULT_OPTIONS.header,
    footer: config.footer ?? DEFAULT_OPTIONS.footer,
    keepSource: config.keepSource ?? DEFAULT_OPTIONS.keepSource,
    ...(config.outDir ? { outDir: config.outDir } : {}),
  };

  return mergedOptions;
}
