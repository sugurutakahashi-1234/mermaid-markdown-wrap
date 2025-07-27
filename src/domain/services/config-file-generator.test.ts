import { describe, expect, it } from "bun:test";
import type { ConfigOptions } from "../models/options.js";
import {
  generateConfigFileContent,
  generateConfigFileName,
} from "./config-file-generator.js";

describe("config-file-generator", () => {
  const testConfig: ConfigOptions = {
    outDir: "docs",
    header: "<!-- AUTO-GENERATED -->",
    footer: "<!-- END -->",
    removeSource: false,
    hideCommand: false,
  };

  describe("generateConfigFileName", () => {
    it("should generate correct file names for each format", () => {
      expect(generateConfigFileName("ts")).toBe(
        "mermaid-markdown-wrap.config.ts",
      );
      expect(generateConfigFileName("js")).toBe(
        "mermaid-markdown-wrap.config.js",
      );
      expect(generateConfigFileName("cjs")).toBe(
        "mermaid-markdown-wrap.config.cjs",
      );
      expect(generateConfigFileName("mjs")).toBe(
        "mermaid-markdown-wrap.config.mjs",
      );
      expect(generateConfigFileName("json")).toBe(
        ".mermaid-markdown-wraprc.json",
      );
      expect(generateConfigFileName("yaml")).toBe(
        ".mermaid-markdown-wraprc.yaml",
      );
    });
  });

  describe("generateConfigFileContent", () => {
    it("should generate TypeScript config with defineConfig", () => {
      const content = generateConfigFileContent(testConfig, "ts");
      expect(content).toContain(
        "import { defineConfig } from 'mermaid-markdown-wrap/config';",
      );
      expect(content).toContain("export default defineConfig(");
      expect(content).toContain('"outDir": "docs"');
    });

    it("should generate JavaScript config with JSDoc comments", () => {
      const content = generateConfigFileContent(testConfig, "js");
      expect(content).toContain(
        "/** @type {import('mermaid-markdown-wrap/config').ConfigOptions} */",
      );
      expect(content).toContain("module.exports =");
      expect(content).toContain('"outDir": "docs"');
    });

    it("should generate CommonJS config", () => {
      const content = generateConfigFileContent(testConfig, "cjs");
      expect(content).toContain(
        "/** @type {import('mermaid-markdown-wrap/config').ConfigOptions} */",
      );
      expect(content).toContain("module.exports =");
    });

    it("should generate ESM config", () => {
      const content = generateConfigFileContent(testConfig, "mjs");
      expect(content).toContain(
        "/** @type {import('mermaid-markdown-wrap/config').ConfigOptions} */",
      );
      expect(content).toContain("export default");
    });

    it("should generate JSON config", () => {
      const content = generateConfigFileContent(testConfig, "json");
      const parsed = JSON.parse(content);
      expect(parsed).toEqual(testConfig);
    });

    it("should generate YAML config", () => {
      const content = generateConfigFileContent(testConfig, "yaml");
      expect(content).toContain("outDir: docs");
      expect(content).toContain("removeSource: false");
      expect(content).toContain("hideCommand: false");
    });
  });
});
