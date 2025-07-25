/**
 * Configuration file type definitions for mermaid-markdown-wrap
 *
 * IMPORTANT: This file is publicly exported via package.json "exports" field
 * as "mermaid-markdown-wrap/config" and MUST remain in this location.
 * Moving this file would be a breaking change for TypeScript users.
 *
 * You can use this type definition in your TypeScript configuration file:
 *
 * @example
 * ```ts
 * // mermaid-markdown-wrap.config.ts
 * import type { Config } from 'mermaid-markdown-wrap/config';
 *
 * const config: Config = {
 *   outDir: 'docs',
 *   extension: '.md',
 *   header: '<!-- AUTO-GENERATED -->',
 *   footer: '<!-- END -->',
 *   keepSource: false,
 * };
 *
 * export default config;
 * ```
 *
 * @public
 */
export type { ConfigOptions as Config } from "../domain/cli-options.js";
