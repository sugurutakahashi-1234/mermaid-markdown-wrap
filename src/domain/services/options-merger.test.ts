import { describe, expect, test } from "bun:test";
import { mergeOptions } from "../../domain/services/options-merger.js";

describe("mergeOptions", () => {
  test("CLI options take precedence over config options", () => {
    const result = mergeOptions(
      { removeSource: true },
      { removeSource: false, header: "config header" },
    );

    expect(result.removeSource).toBe(true);
    expect(result.header).toBe("config header"); // from config since not in CLI
  });

  test("config options take precedence over defaults", () => {
    const result = mergeOptions({}, { footer: "custom" });

    expect(result.footer).toBe("custom");
    expect(result.header).toBe(""); // default
    expect(result.removeSource).toBe(false); // default
    expect(result.showCommand).toBe(true); // default
  });

  test("uses defaults when no options provided", () => {
    const result = mergeOptions({}, {});

    expect(result.header).toBe("");
    expect(result.footer).toBe("");
    expect(result.removeSource).toBe(false);
    expect(result.showCommand).toBe(true);
  });

  test("handles optional fields correctly", () => {
    const result = mergeOptions(
      { config: "custom.json" },
      { outDir: "output" },
    );

    expect(result.config).toBe("custom.json");
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
