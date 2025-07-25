import { describe, expect, test } from "bun:test";
import { getOutputPath } from "./path-calculator.js";

describe("getOutputPath", () => {
  test("calculates output path for basic .mmd file", () => {
    const inputPath = "/project/diagrams/flow.mmd";
    const options = {
      extension: ".md",
      keepSource: false,
      header: "",
      footer: "",
    };

    const result = getOutputPath(inputPath, options);

    expect(result).toBe("/project/diagrams/flow.md");
  });

  test("calculates output path for .mermaid file", () => {
    const inputPath = "/home/user/chart.mermaid";
    const options = {
      extension: ".md",
      keepSource: false,
      header: "",
      footer: "",
    };

    const result = getOutputPath(inputPath, options);

    expect(result).toBe("/home/user/chart.md");
  });

  test("handles files without extension", () => {
    const inputPath = "/tmp/diagram";
    const options = {
      extension: ".md",
      keepSource: false,
      header: "",
      footer: "",
    };

    const result = getOutputPath(inputPath, options);

    expect(result).toBe("/tmp/diagram.md");
  });

  test("handles files with multiple dots in name", () => {
    const inputPath = "/docs/my.diagram.test.mmd";
    const options = {
      extension: ".md",
      keepSource: false,
      header: "",
      footer: "",
    };

    const result = getOutputPath(inputPath, options);

    expect(result).toBe("/docs/my.diagram.test.md");
  });

  test("uses custom extension from options", () => {
    const inputPath = "/project/flow.mmd";
    const options = {
      extension: ".markdown",
      keepSource: false,
      header: "",
      footer: "",
    };

    const result = getOutputPath(inputPath, options);

    expect(result).toBe("/project/flow.markdown");
  });

  test("uses outDir when specified", () => {
    const inputPath = "/source/diagrams/flow.mmd";
    const options = {
      extension: ".md",
      keepSource: false,
      header: "",
      footer: "",
      outDir: "/output/markdown",
    };

    const result = getOutputPath(inputPath, options);

    expect(result).toBe("/output/markdown/flow.md");
  });

  test("handles relative paths", () => {
    const inputPath = "src/diagrams/architecture.mmd";
    const options = {
      extension: ".md",
      keepSource: false,
      header: "",
      footer: "",
    };

    const result = getOutputPath(inputPath, options);

    expect(result).toBe("src/diagrams/architecture.md");
  });

  test("handles relative outDir", () => {
    const inputPath = "diagrams/flow.mmd";
    const options = {
      extension: ".md",
      keepSource: false,
      header: "",
      footer: "",
      outDir: "output",
    };

    const result = getOutputPath(inputPath, options);

    expect(result).toBe("output/flow.md");
  });

  test("handles nested directory structures", () => {
    const inputPath = "/project/src/components/ui/diagram.mmd";
    const options = {
      extension: ".md",
      keepSource: false,
      header: "",
      footer: "",
      outDir: "/project/docs",
    };

    const result = getOutputPath(inputPath, options);

    expect(result).toBe("/project/docs/diagram.md");
  });

  test("handles current directory files", () => {
    const inputPath = "diagram.mmd";
    const options = {
      extension: ".md",
      keepSource: false,
      header: "",
      footer: "",
    };

    const result = getOutputPath(inputPath, options);

    expect(result).toBe("diagram.md");
  });

  test("handles Windows-style paths", () => {
    const inputPath = "C:\\Users\\project\\diagram.mmd";
    const options = {
      extension: ".md",
      keepSource: false,
      header: "",
      footer: "",
    };

    const result = getOutputPath(inputPath, options);

    // Node.js path module handles path separators based on the platform
    expect(result).toMatch(/diagram\.md$/);
  });

  test("preserves trailing dots in filename", () => {
    const inputPath = "/project/diagram..mmd";
    const options = {
      extension: ".md",
      keepSource: false,
      header: "",
      footer: "",
    };

    const result = getOutputPath(inputPath, options);

    expect(result).toBe("/project/diagram..md");
  });
});
