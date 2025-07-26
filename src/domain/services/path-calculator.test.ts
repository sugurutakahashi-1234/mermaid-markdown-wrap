import { describe, expect, test } from "bun:test";
import type { ProcessingOptions } from "../models/options.js";
import { getOutputPath } from "./path-calculator.js";

// Test helper - specific to this test file
const createOptions = (
  overrides: Partial<ProcessingOptions> = {},
): ProcessingOptions => ({
  header: "",
  footer: "",
  removeSource: false,
  showCommand: true,
  logFormat: "text",
  quiet: false,
  ...overrides,
});

describe("getOutputPath", () => {
  test("calculates output path for basic .mmd file", () => {
    const inputPath = "/project/diagrams/flow.mmd";
    const options = createOptions();

    const result = getOutputPath(inputPath, options);

    expect(result).toBe("/project/diagrams/flow.md");
  });

  test("calculates output path for .mermaid file", () => {
    const inputPath = "/home/user/chart.mermaid";
    const options = createOptions();

    const result = getOutputPath(inputPath, options);

    expect(result).toBe("/home/user/chart.md");
  });

  test("handles files without extension", () => {
    const inputPath = "/tmp/diagram";
    const options = createOptions();

    const result = getOutputPath(inputPath, options);

    expect(result).toBe("/tmp/diagram.md");
  });

  test("handles files with multiple dots in name", () => {
    const inputPath = "/docs/my.diagram.test.mmd";
    const options = createOptions();

    const result = getOutputPath(inputPath, options);

    expect(result).toBe("/docs/my.diagram.test.md");
  });

  test("uses outDir when specified", () => {
    const inputPath = "/source/diagrams/flow.mmd";
    const options = createOptions({
      outDir: "/output",
    });

    const result = getOutputPath(inputPath, options);

    expect(result).toBe("/output/flow.md");
  });

  test("handles relative paths", () => {
    const inputPath = "src/diagrams/architecture.mmd";
    const options = createOptions();

    const result = getOutputPath(inputPath, options);

    expect(result).toBe("src/diagrams/architecture.md");
  });

  test("handles relative outDir", () => {
    const inputPath = "diagrams/flow.mmd";
    const options = createOptions({
      outDir: "output",
    });

    const result = getOutputPath(inputPath, options);

    expect(result).toBe("output/flow.md");
  });

  test("handles nested directory structures", () => {
    const inputPath = "/project/src/components/ui/diagram.mmd";
    const options = createOptions({
      outDir: "/project/build",
    });

    const result = getOutputPath(inputPath, options);

    expect(result).toBe("/project/build/diagram.md");
  });

  test("handles current directory files", () => {
    const inputPath = "diagram.mmd";
    const options = createOptions();

    const result = getOutputPath(inputPath, options);

    expect(result).toBe("diagram.md");
  });

  test("handles Windows-style paths", () => {
    const inputPath = "C:\\Users\\project\\diagram.mmd";
    const options = createOptions();

    const result = getOutputPath(inputPath, options);

    // Note: Path normalization depends on the platform
    expect(result).toBe("C:\\Users\\project\\diagram.md");
  });

  test("preserves trailing dots in filename", () => {
    const inputPath = "/project/diagram..mmd";
    const options = createOptions();

    const result = getOutputPath(inputPath, options);

    expect(result).toBe("/project/diagram..md");
  });
});
