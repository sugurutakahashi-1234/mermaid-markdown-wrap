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
 */
export interface Config {
  /**
   * Output directory for converted files
   * If not specified, files are saved in the same directory as source files
   */
  outDir?: string;

  /**
   * Output file extension
   * @default ".md"
   */
  extension?: string;

  /**
   * Header text to prepend to the output file
   * @default ""
   */
  header?: string;

  /**
   * Footer text to append to the output file
   * @default ""
   */
  footer?: string;

  /**
   * Whether to keep source .mmd files after conversion
   * @default false
   */
  keepSource?: boolean;
}
