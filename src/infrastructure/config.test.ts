import { describe, expect, test } from "bun:test";
import { mergeOptions } from "./config.js";

describe("mergeOptions", () => {
  test("CLI options take precedence over config options", () => {
    const result = mergeOptions(
      { extension: ".cli", keepSource: true },
      { extension: ".config", keepSource: false, header: "config header" },
    );

    expect(result.extension).toBe(".cli");
    expect(result.keepSource).toBe(true);
    expect(result.header).toBe("config header"); // from config since not in CLI
  });

  test("config options take precedence over defaults", () => {
    const result = mergeOptions({}, { extension: ".config", footer: "custom" });

    expect(result.extension).toBe(".config");
    expect(result.footer).toBe("custom");
    expect(result.header).toBe(""); // default
    expect(result.keepSource).toBe(false); // default
  });

  test("uses defaults when no options provided", () => {
    const result = mergeOptions({}, {});

    expect(result.extension).toBe(".md");
    expect(result.header).toBe("");
    expect(result.footer).toBe("");
    expect(result.keepSource).toBe(false);
  });

  test("handles optional fields correctly", () => {
    const result = mergeOptions({ glob: "**/*.mmd" }, { outDir: "output" });

    expect(result.glob).toBe("**/*.mmd");
    expect(result.outDir).toBe("output");
  });

  test("CLI outDir overrides config outDir", () => {
    const result = mergeOptions(
      { outDir: "cli-output" },
      { outDir: "config-output" },
    );

    expect(result.outDir).toBe("cli-output");
  });
});
