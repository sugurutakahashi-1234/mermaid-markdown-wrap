import type { Options } from "../domain/types.js";

/**
 * Build markdown content with header, mermaid code block, and footer
 */
export function buildMarkdownContent(
  mermaidContent: string,
  options: Options,
): string {
  const parts: string[] = [];

  // Add header if provided
  if (options.header) {
    parts.push(options.header);
    parts.push(""); // Empty line after header
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
