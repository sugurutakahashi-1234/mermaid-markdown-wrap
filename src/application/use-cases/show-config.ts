import type { ConfigOptions } from "../../domain/models/options.js";
import { loadConfigurationFile } from "../../infrastructure/adapters/cosmiconfig.adapter.js";

/**
 * Show configuration use case
 * Loads and merges configuration for display
 */
export async function showConfigUseCase(
  configFile?: string,
): Promise<ConfigOptions> {
  // Load configuration
  const config = await loadConfigurationFile(configFile);

  // Apply defaults to configuration for display
  const mergedOptions: ConfigOptions = {
    header: config.header ?? "",
    footer: config.footer ?? "",
    removeSource: config.removeSource ?? false,
    showCommand: config.showCommand ?? true,
    ...(config.outDir ? { outDir: config.outDir } : {}),
  };

  return mergedOptions;
}
