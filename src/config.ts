/**
 * Configuration helpers for mermaid-markdown-wrap
 *
 * This file provides type-safe configuration utilities for TypeScript users.
 */

import type { ConfigOptions } from "./domain/models/options.js";

// Re-export the type without renaming
export type { ConfigOptions } from "./domain/models/options.js";

/**
 * Helper function to define configuration with type safety
 *
 * @example
 * ```ts
 * // mermaid-markdown-wrap.config.ts
 * import { defineConfig } from 'mermaid-markdown-wrap/config';
 *
 * export default defineConfig({
 *   outDir: 'docs',
 *   header: '<!-- AUTO-GENERATED -->',
 *   footer: '<!-- END -->',
 *   removeSource: false,
 * });
 * ```
 *
 * @param config - The configuration options
 * @returns The same configuration object with type inference
 */
export function defineConfig(config: ConfigOptions): ConfigOptions {
  return config;
}
