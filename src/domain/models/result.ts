/**
 * File conversion result model
 *
 * This type represents the outcome of converting a single Mermaid file.
 * It's a fundamental business concept - we need to track which files
 * succeeded or failed during the conversion process.
 */

/**
 * Result of processing a single Mermaid file
 */
export interface FileConversionResult {
  filePath: string;
  success: boolean;
  error?: Error;
}
