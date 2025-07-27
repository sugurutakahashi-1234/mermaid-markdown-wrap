/**
 * Extract Mermaid content from text that may already contain Mermaid code blocks
 *
 * This utility helps prevent double-wrapping of Mermaid content in code blocks
 * by detecting and extracting content from existing ```mermaid blocks.
 */

/**
 * Extracts Mermaid content from text, handling cases where the content
 * might already be wrapped in a Mermaid code block.
 *
 * @param content - The input text that may contain Mermaid code blocks
 * @returns The extracted Mermaid content, or the original content if no blocks found
 */
export function extractMermaidContent(content: string): string {
  // Trim to check if the entire content is a mermaid code block
  const trimmedContent = content.trim();

  // Check if content starts with ```mermaid and ends with ```
  const MERMAID_BLOCK_START = "```mermaid";
  const BLOCK_END = "```";

  if (!trimmedContent.startsWith(MERMAID_BLOCK_START)) {
    return content;
  }

  if (!trimmedContent.endsWith(BLOCK_END)) {
    return content;
  }

  // Remove the opening ```mermaid
  const contentAfterStart = trimmedContent.slice(MERMAID_BLOCK_START.length);

  // Remove the closing ``` (3 characters)
  const contentWithoutMarkers = contentAfterStart.slice(0, -3);

  // The content should start with a newline after ```mermaid
  if (contentWithoutMarkers.startsWith("\n")) {
    // Remove the leading newline
    let mermaidContent = contentWithoutMarkers.slice(1);

    // Remove trailing newline if present (commonly added before closing ```)
    if (mermaidContent.endsWith("\n")) {
      mermaidContent = mermaidContent.slice(0, -1);
    }

    return mermaidContent;
  }

  // If there's no newline after ```mermaid, it's not a valid block
  return content;
}
