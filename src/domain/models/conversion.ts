/**
 * Mermaid file conversion domain models
 *
 * These types represent the core business concepts of converting
 * Mermaid files to Markdown format. They use domain-specific terminology
 * that clearly expresses the purpose and meaning of each entity.
 */

/**
 * Result of converting a single Mermaid file to Markdown
 */
export interface MermaidConversion {
  mermaidFile: string;
  markdownFile: string;
  converted: boolean;
  failureReason?: string;
}

/**
 * Report of a batch conversion operation
 */
export interface ConversionReport {
  summary: {
    totalMermaidFiles: number;
    successfulConversions: number;
    failedConversions: number;
  };
  conversions: MermaidConversion[];
}
