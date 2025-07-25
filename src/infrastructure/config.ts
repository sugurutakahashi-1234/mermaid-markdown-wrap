import { cosmiconfig } from "cosmiconfig";
import { TypeScriptLoader } from "cosmiconfig-typescript-loader";
import type {
  CLIOptions,
  ConfigOptions,
  Options,
} from "../domain/cli-options.js";
import { DEFAULT_OPTIONS } from "../domain/cli-options.js";

/**
 * Load configuration from file or search for it
 */
export async function loadConfig(configPath?: string): Promise<ConfigOptions> {
  const explorer = cosmiconfig("mermaid-markdown-wrap", {
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

/**
 * Merge options from CLI, config file, and defaults
 * Priority: CLI > Config > Defaults
 */
export function mergeOptions(
  cliOptions: CLIOptions,
  configOptions: ConfigOptions,
): Options {
  return {
    extension:
      cliOptions.extension ??
      configOptions.extension ??
      DEFAULT_OPTIONS.extension,
    header: cliOptions.header ?? configOptions.header ?? DEFAULT_OPTIONS.header,
    footer: cliOptions.footer ?? configOptions.footer ?? DEFAULT_OPTIONS.footer,
    keepSource:
      cliOptions.keepSource ??
      configOptions.keepSource ??
      DEFAULT_OPTIONS.keepSource,
    ...((cliOptions.outDir ?? configOptions.outDir)
      ? { outDir: cliOptions.outDir ?? configOptions.outDir }
      : {}),
    ...(cliOptions.glob ? { glob: cliOptions.glob } : {}),
    ...(cliOptions.config ? { config: cliOptions.config } : {}),
  };
}
