/**
 * Mermaid to Markdown formatting rules
 *
 * This module defines the core business logic of how Mermaid content
 * should be formatted into Markdown. This is the essence of what this
 * application does - wrapping Mermaid diagrams in Markdown code blocks.
 */

import type { Options } from "../models/options.js";

/**
 * Format Mermaid content as a Markdown code block with optional header/footer and command info
 *
 * This is the core business rule: Mermaid content must be wrapped in
 * triple backticks with the 'mermaid' language identifier.
 */
export function formatMermaidAsMarkdown(
  mermaidContent: string,
  options: Options,
  commandInfo?: string,
): string {
  const parts: string[] = [];

  // Add header if provided
  if (options.header) {
    parts.push(options.header);
    parts.push(""); // Empty line after header
  }

  // Add command info if showCommand is true and commandInfo is provided
  if (options.showCommand && commandInfo) {
    parts.push("```bash");
    parts.push(commandInfo);
    parts.push("```");
    parts.push(""); // Empty line after command block
  }

  // Add mermaid code block
  parts.push("```mermaid");
  parts.push(mermaidContent.trim());
  parts.push("```");

  // Add footer if provided
  if (options.footer) {
    parts.push(""); // Empty line before footer
    parts.push(options.footer);
  }

  return parts.join("\n");
}
