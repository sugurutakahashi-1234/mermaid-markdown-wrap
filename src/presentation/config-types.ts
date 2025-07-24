/**
 * Configuration file type definitions for mermaid-markdown-wrap
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
