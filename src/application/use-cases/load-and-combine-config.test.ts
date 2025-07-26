import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { fileSystemAdapter } from "../../infrastructure/adapters/file-system.adapter.js";
import { loadAndCombineConfigUseCase } from "./load-and-combine-config.js";

describe("loadAndCombineConfigUseCase", () => {
  const testConfigPath = ".test-config.json";

  beforeEach(async () => {
    // Create test config file
    const testConfig = {
      header: "Test Header",
      footer: "Test Footer",
      removeSource: true,
      showCommand: false,
      outDir: "test-output",
    };
    await fileSystemAdapter.writeFile(
      testConfigPath,
      JSON.stringify(testConfig, null, 2),
    );
  });

  afterEach(async () => {
    // Clean up test files
    try {
      await fileSystemAdapter.deleteFile(testConfigPath);
    } catch {
      // Ignore if file doesn't exist
    }
  });

  it("should load config file and combine with CLI options", async () => {
    // CLI options with config path
    const cmdOptions = {
      config: testConfigPath,
      header: "CLI Header", // This should override config
      quiet: true, // This is CLI-only option
    };

    const result = await loadAndCombineConfigUseCase(cmdOptions);

    // Check rawCliOptions
    expect(result.rawCliOptions).toEqual({
      config: testConfigPath,
      header: "CLI Header",
      quiet: true,
    });

    // Check processingOptions (CLI overrides config)
    expect(result.processingOptions.header).toBe("CLI Header"); // CLI wins
    expect(result.processingOptions.footer).toBe("Test Footer"); // From config
    expect(result.processingOptions.removeSource).toBe(true); // From config
    expect(result.processingOptions.showCommand).toBe(false); // From config
    expect(result.processingOptions.outDir).toBe("test-output"); // From config
    expect(result.processingOptions.quiet).toBe(true); // From CLI
    expect(result.processingOptions.logFormat).toBe("text"); // Default
  });

  it("should use only CLI options when no config file is specified", async () => {
    const cmdOptions = {
      header: "CLI Only Header",
      removeSource: false,
      logFormat: "json",
    };

    const result = await loadAndCombineConfigUseCase(cmdOptions);

    // Check that no config path is set
    expect(result.rawCliOptions.config).toBeUndefined();

    // Check processingOptions use CLI values and defaults
    expect(result.processingOptions.header).toBe("CLI Only Header");
    expect(result.processingOptions.footer).toBe(""); // Default
    expect(result.processingOptions.removeSource).toBe(false);
    expect(result.processingOptions.showCommand).toBe(true); // Default
    expect(result.processingOptions.logFormat).toBe("json");
  });

  it("should handle non-existent config file gracefully", async () => {
    const cmdOptions = {
      config: "non-existent-config.json",
      header: "Fallback Header",
    };

    // Should throw an error for non-existent config file when explicitly specified
    await expect(loadAndCombineConfigUseCase(cmdOptions)).rejects.toThrow();
  });

  it("should apply all defaults when no options are provided", async () => {
    const cmdOptions = {};

    const result = await loadAndCombineConfigUseCase(cmdOptions);

    // Check all defaults are applied
    expect(result.processingOptions.header).toBe("");
    expect(result.processingOptions.footer).toBe("");
    expect(result.processingOptions.removeSource).toBe(false);
    expect(result.processingOptions.showCommand).toBe(true);
    expect(result.processingOptions.logFormat).toBe("text");
    expect(result.processingOptions.quiet).toBe(false);
    expect(result.processingOptions.outDir).toBeUndefined();
  });
});
