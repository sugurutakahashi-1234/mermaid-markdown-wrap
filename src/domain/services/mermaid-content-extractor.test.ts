import { describe, expect, test } from "bun:test";
import { extractMermaidContent } from "./mermaid-content-extractor.js";

describe("extractMermaidContent", () => {
  test("returns content as-is when no mermaid code block exists", () => {
    const content = "graph TD\n  A --> B";
    const result = extractMermaidContent(content);
    expect(result).toBe(content);
  });

  test("extracts content from a single mermaid code block", () => {
    const content = "```mermaid\ngraph TD\n  A --> B\n```";
    const result = extractMermaidContent(content);
    expect(result).toBe("graph TD\n  A --> B");
  });

  test("extracts content with surrounding whitespace", () => {
    const content = "\n\n```mermaid\ngraph TD\n  A --> B\n```\n\n";
    const result = extractMermaidContent(content);
    expect(result).toBe("graph TD\n  A --> B");
  });

  test("preserves content if no closing tag", () => {
    const content = "```mermaid\ngraph TD\n  A --> B";
    const result = extractMermaidContent(content);
    // If no closing tag, return original content to avoid data loss
    expect(result).toBe(content);
  });

  test("handles nested backticks in mermaid content", () => {
    const content = '```mermaid\ngraph TD\n  A["`Code`"] --> B\n```';
    const result = extractMermaidContent(content);
    expect(result).toBe('graph TD\n  A["`Code`"] --> B');
  });

  test("ignores non-mermaid code blocks", () => {
    const content = `\`\`\`javascript
console.log('hello');
\`\`\``;
    const result = extractMermaidContent(content);
    expect(result).toBe(content);
  });

  test("ignores content with text around mermaid block", () => {
    const content = `Header text
\`\`\`mermaid
graph TD
\`\`\`
Footer text`;
    const result = extractMermaidContent(content);
    // Should return original as it's not a pure mermaid block
    expect(result).toBe(content);
  });
});
