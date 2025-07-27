import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawn } from "bun";
import packageJson from "../package.json" with { type: "json" };

let testDir: string;
const cliPath = join(import.meta.dir, "index.ts");

describe("CLI", () => {
  beforeEach(async () => {
    // Create unique temp directory for each test
    testDir = join(
      tmpdir(),
      `mermaid-wrap-test-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    );
    await mkdir(testDir, { recursive: true });
  });

  afterEach(async () => {
    // Clean up test directory
    try {
      await rm(testDir, { recursive: true, force: true });
    } catch {
      // Ignore cleanup errors
    }
  });

  test("converts single file", async () => {
    const inputFile = join(testDir, "diagram.mmd");
    const outputFile = join(testDir, "diagram.md");

    await writeFile(inputFile, "graph TD\n  A --> B");

    const proc = spawn(["bun", cliPath, inputFile], {
      cwd: testDir,
      stdout: "pipe",
      stderr: "pipe",
    });

    const output = await new Response(proc.stdout).text();
    await proc.exited;

    expect(proc.exitCode).toBe(0);
    expect(output).toContain("->");
    expect(output).toContain("diagram.mmd");
    expect(output).toContain("diagram.md");

    const result = await readFile(outputFile, "utf-8");
    expect(result).toContain("```mermaid");
    expect(result).toContain("graph TD");
  });

  test("converts with header and footer", async () => {
    const inputFile = join(testDir, "test.mmd");
    const outputFile = join(testDir, "test.md");

    await writeFile(inputFile, "graph LR");

    const proc = spawn(
      [
        "bun",
        cliPath,
        inputFile,
        "--header",
        "# Test Header",
        "--footer",
        "Test Footer",
      ],
      {
        cwd: testDir,
        stdout: "pipe",
        stderr: "pipe",
      },
    );

    await proc.exited;
    expect(proc.exitCode).toBe(0);

    const result = await readFile(outputFile, "utf-8");
    expect(result).toContain("# Test Header");
    expect(result).toContain("Test Footer");
  });

  test("uses glob pattern", async () => {
    await writeFile(join(testDir, "a.mmd"), "graph TD");
    await writeFile(join(testDir, "b.mmd"), "graph LR");

    const proc = spawn(["bun", cliPath, "*.mmd"], {
      cwd: testDir,
      stdout: "pipe",
      stderr: "pipe",
    });

    const output = await new Response(proc.stdout).text();
    await proc.exited;

    expect(proc.exitCode).toBe(0);
    expect(output).toContain("2 files converted (2 success, 0 failed)");
    expect(output).toContain("a.mmd ->");
    expect(output).toContain("b.mmd ->");

    const aExists = await Bun.file(join(testDir, "a.md")).exists();
    const bExists = await Bun.file(join(testDir, "b.md")).exists();
    expect(aExists).toBe(true);
    expect(bExists).toBe(true);
  });

  test("config-show command shows config", async () => {
    const proc = spawn(["bun", cliPath, "config-show"], {
      stdout: "pipe",
      stderr: "pipe",
    });

    const output = await new Response(proc.stdout).text();
    await proc.exited;

    expect(proc.exitCode).toBe(0);
    expect(output).toContain("✅ Current configuration:");
    expect(output).toContain('"removeSource"');

    // Extract JSON from output (skip the first line with the message)
    const jsonPart = output.split("\n").slice(1).join("\n");
    const config = JSON.parse(jsonPart);
    expect(config).toHaveProperty("removeSource");
  });

  test("loads config from YAML file", async () => {
    // Create config file
    const configPath = join(testDir, ".mermaid-markdown-wraprc.yaml");
    await writeFile(configPath, `header: "YAML header"`);

    // Create test file
    const mmdPath = join(testDir, "test.mmd");
    await writeFile(mmdPath, "graph TD\n  A --> B");

    // Run CLI with config
    const proc = spawn(["bun", cliPath, mmdPath], {
      cwd: testDir,
      stdout: "pipe",
      stderr: "pipe",
    });

    await proc.exited;
    expect(proc.exitCode).toBe(0);

    // Check output contains header from config
    const outputPath = join(testDir, "test.md");
    const content = await readFile(outputPath, "utf-8");
    expect(content).toContain("YAML header");
    expect(content).toContain("```mermaid");
  });

  test("CLI options override config file", async () => {
    // Create config file
    const configPath = join(testDir, ".mermaid-markdown-wraprc.yaml");
    await writeFile(configPath, `header: "Config header"`);

    // Create test file
    const mmdPath = join(testDir, "test.mmd");
    await writeFile(mmdPath, "graph TD\n  A --> B");

    // Run CLI with options that override config
    const proc = spawn(["bun", cliPath, mmdPath, "--header", "CLI header"], {
      cwd: testDir,
      stdout: "pipe",
      stderr: "pipe",
    });

    await proc.exited;
    expect(proc.exitCode).toBe(0);

    // Check output uses CLI options
    const outputPath = join(testDir, "test.md");
    const content = await readFile(outputPath, "utf-8");
    expect(content).toContain("CLI header");
    expect(content).not.toContain("Config header");
  });

  test("handles no files found", async () => {
    const proc = spawn(["bun", cliPath, "*.nonexistent"], {
      cwd: testDir,
      stdout: "pipe",
      stderr: "pipe",
    });

    const stderr = await new Response(proc.stderr).text();
    await proc.exited;

    expect(proc.exitCode).toBe(1);
    expect(stderr).toContain("No files found");
  });

  test("shows version", async () => {
    const proc = spawn(["bun", cliPath, "-v"], {
      stdout: "pipe",
      stderr: "pipe",
    });

    const output = await new Response(proc.stdout).text();
    await proc.exited;

    expect(proc.exitCode).toBe(0);
    expect(output).toContain(packageJson.version);
  });

  test("shows output path in default mode", async () => {
    const inputFile = join(testDir, "test.mmd");
    await writeFile(inputFile, "graph TD\n  A --> B");

    const proc = spawn(["bun", cliPath, inputFile], {
      cwd: testDir,
      stdout: "pipe",
      stderr: "pipe",
    });

    const output = await new Response(proc.stdout).text();
    await proc.exited;

    expect(proc.exitCode).toBe(0);
    expect(output).toContain("->");
    expect(output).toContain("test.mmd");
    expect(output).toContain("test.md");
  });

  test("quiet mode suppresses normal output", async () => {
    const inputFile = join(testDir, "test.mmd");
    await writeFile(inputFile, "graph TD\n  A --> B");

    const proc = spawn(["bun", cliPath, inputFile, "--quiet"], {
      cwd: testDir,
      stdout: "pipe",
      stderr: "pipe",
    });

    const output = await new Response(proc.stdout).text();
    await proc.exited;

    expect(proc.exitCode).toBe(0);
    expect(output.trim()).toBe(""); // No output in quiet mode

    // But file should still be created
    const outputFile = join(testDir, "test.md");
    const exists = await Bun.file(outputFile).exists();
    expect(exists).toBe(true);
  });

  // Verbose mode has been removed

  test("invalid log format shows error", async () => {
    const inputFile = join(testDir, "test.mmd");
    await writeFile(inputFile, "graph TD");

    const proc = spawn(["bun", cliPath, inputFile, "--log-format", "invalid"], {
      cwd: testDir,
      stdout: "pipe",
      stderr: "pipe",
    });

    const stderr = await new Response(proc.stderr).text();
    await proc.exited;

    expect(proc.exitCode).toBe(1);
    expect(stderr).toContain("Error: Invalid options: Invalid log format");
  });

  test("outputs JSON format with --log-format json", async () => {
    const inputFile = join(testDir, "test.mmd");
    await writeFile(inputFile, "graph TD\n  A --> B");

    const proc = spawn(["bun", cliPath, inputFile, "--log-format", "json"], {
      cwd: testDir,
      stdout: "pipe",
      stderr: "pipe",
    });

    const output = await new Response(proc.stdout).text();
    await proc.exited;

    expect(proc.exitCode).toBe(0);

    // Parse JSON output
    const result = JSON.parse(output);
    expect(result).toHaveProperty("summary");
    expect(result.summary).toHaveProperty("totalMermaidFiles", 1);
    expect(result.summary).toHaveProperty("successfulConversions", 1);
    expect(result.summary).toHaveProperty("failedConversions", 0);
    expect(result).toHaveProperty("conversions");
    expect(result.conversions).toBeArray();
    expect(result.conversions).toHaveLength(1);
    expect(result.conversions[0].converted).toBe(true);
    expect(result.conversions[0].mermaidFile).toContain("test.mmd");
    expect(result.conversions[0].markdownFile).toContain("test.md");
  });

  describe("config-validate subcommand", () => {
    test("validates valid config file", async () => {
      const configPath = join(testDir, "valid-config.yaml");
      await writeFile(configPath, `header: "Test header"\nremoveSource: true`);

      const proc = spawn(["bun", cliPath, "config-validate", configPath], {
        cwd: testDir,
        stdout: "pipe",
        stderr: "pipe",
      });

      const output = await new Response(proc.stdout).text();
      await proc.exited;

      expect(proc.exitCode).toBe(0);
      expect(output).toContain("✅ Config looks good!");
    });

    test("reports validation errors for invalid config", async () => {
      const configPath = join(testDir, "invalid-config.json");
      await writeFile(
        configPath,
        JSON.stringify({
          removeSource: "yes", // Should be boolean
          header: 123, // Should be string
        }),
      );

      const proc = spawn(["bun", cliPath, "config-validate", configPath], {
        cwd: testDir,
        stdout: "pipe",
        stderr: "pipe",
      });

      const stderr = await new Response(proc.stderr).text();
      await proc.exited;

      expect(proc.exitCode).toBe(1);
      expect(stderr).toContain("❌ Invalid config:");
      expect(stderr).toContain("root: Invalid configuration:");
    });

    test("validates config when no file is specified", async () => {
      // Create default config file
      const configPath = join(testDir, ".mermaid-markdown-wraprc.yaml");
      await writeFile(configPath, `footer: "Default footer"`);

      const proc = spawn(["bun", cliPath, "config-validate"], {
        cwd: testDir,
        stdout: "pipe",
        stderr: "pipe",
      });

      const output = await new Response(proc.stdout).text();
      await proc.exited;

      expect(proc.exitCode).toBe(0);
      expect(output).toContain("✅ Config looks good!");
    });

    test("handles missing config file with error", async () => {
      const proc = spawn(
        ["bun", cliPath, "config-validate", "nonexistent.yaml"],
        {
          cwd: testDir,
          stdout: "pipe",
          stderr: "pipe",
        },
      );

      const stderr = await new Response(proc.stderr).text();
      await proc.exited;

      // Should fail when specified config file is not found
      expect(proc.exitCode).toBe(1);
      expect(stderr).toContain("❌ Invalid config:");
      expect(stderr).toContain("ENOENT: no such file or directory");
    });
  });
});
