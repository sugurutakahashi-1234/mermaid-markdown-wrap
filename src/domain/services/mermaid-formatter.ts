/**
 * Mermaid to Markdown formatting rules
 *
 * This module defines the core business logic of how Mermaid content
 * should be formatted into Markdown. This is the essence of what this
 * application does - wrapping Mermaid diagrams in Markdown code blocks.
 */

import type { ProcessingOptions } from "../models/options.js";
import { extractMermaidContent } from "./mermaid-content-extractor.js";

/**
 * Format Mermaid content as a Markdown code block with optional header/footer and command info
 *
 * This is the core business rule: Mermaid content must be wrapped in
 * triple backticks with the 'mermaid' language identifier.
 */
export function formatMermaidAsMarkdown(
  mermaidContent: string,
  options: ProcessingOptions,
  commandInfo?: string,
): string {
  const parts: string[] = [];

  // Extract content from existing mermaid code blocks if present
  // This prevents double-wrapping of already formatted content
  const contentToWrap = extractMermaidContent(mermaidContent);

  // Add header if provided
  if (options.header) {
    parts.push(options.header);
    parts.push(""); // Empty line after header
  }

  // Add command info if hideCommand is false and commandInfo is provided
  if (!options.hideCommand && commandInfo) {
    parts.push("```bash");
    parts.push(commandInfo);
    parts.push("```");
    parts.push(""); // Empty line after command block
  }

  // Add mermaid code block with content to wrap
  parts.push("```mermaid");
  parts.push(contentToWrap.trim());
  parts.push("```");

  // Add footer if provided
  if (options.footer) {
    parts.push(""); // Empty line before footer
    parts.push(options.footer);
  }

  return parts.join("\n");
}
