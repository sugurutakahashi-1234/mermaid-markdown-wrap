import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawn } from "bun";

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

    const proc = spawn(["bun", cliPath, inputFile, "--keep-source"], {
      cwd: testDir,
      stdout: "pipe",
      stderr: "pipe",
    });

    const output = await new Response(proc.stdout).text();
    await proc.exited;

    expect(proc.exitCode).toBe(0);
    expect(output).toContain("Converting 1 file(s)");
    expect(output).toContain("✓");

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
        "--keep-source",
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

  test("converts single .mermaid file", async () => {
    const inputFile = join(testDir, "flowchart.mermaid");
    const outputFile = join(testDir, "flowchart.md");

    await writeFile(inputFile, "flowchart LR\n  Start --> End");

    const proc = spawn(["bun", cliPath, inputFile, "--keep-source"], {
      cwd: testDir,
      stdout: "pipe",
      stderr: "pipe",
    });

    const output = await new Response(proc.stdout).text();
    await proc.exited;

    expect(proc.exitCode).toBe(0);
    expect(output).toContain("Converting 1 file(s)");
    expect(output).toContain("✓");

    const result = await readFile(outputFile, "utf-8");
    expect(result).toContain("```mermaid");
    expect(result).toContain("flowchart LR");
    expect(result).toContain("Start --> End");
  });

  test("uses glob pattern", async () => {
    await writeFile(join(testDir, "a.mmd"), "graph TD");
    await writeFile(join(testDir, "b.mmd"), "graph LR");

    const proc = spawn(["bun", cliPath, "*.mmd", "--keep-source"], {
      cwd: testDir,
      stdout: "pipe",
      stderr: "pipe",
    });

    const output = await new Response(proc.stdout).text();
    await proc.exited;

    expect(proc.exitCode).toBe(0);
    expect(output).toContain("Converting");
    expect(output).toContain("file(s)");
    expect(output).toContain("✓ a.mmd");
    expect(output).toContain("✓ b.mmd");

    const aExists = await Bun.file(join(testDir, "a.md")).exists();
    const bExists = await Bun.file(join(testDir, "b.md")).exists();
    expect(aExists).toBe(true);
    expect(bExists).toBe(true);
  });

  test("uses glob pattern with .mermaid files", async () => {
    await writeFile(join(testDir, "flow.mermaid"), "flowchart TD");
    await writeFile(join(testDir, "seq.mermaid"), "sequenceDiagram");

    const proc = spawn(["bun", cliPath, "*.mermaid", "--keep-source"], {
      cwd: testDir,
      stdout: "pipe",
      stderr: "pipe",
    });

    const output = await new Response(proc.stdout).text();
    await proc.exited;

    expect(proc.exitCode).toBe(0);
    expect(output).toContain("Converting");
    expect(output).toContain("file(s)");
    expect(output).toContain("✓ flow.mermaid");
    expect(output).toContain("✓ seq.mermaid");

    const flowExists = await Bun.file(join(testDir, "flow.md")).exists();
    const seqExists = await Bun.file(join(testDir, "seq.md")).exists();
    expect(flowExists).toBe(true);
    expect(seqExists).toBe(true);
  });

  test("uses glob pattern with mixed extensions", async () => {
    await writeFile(join(testDir, "diagram.mmd"), "graph TD");
    await writeFile(join(testDir, "flowchart.mermaid"), "flowchart LR");

    const proc = spawn(["bun", cliPath, "*.{mmd,mermaid}", "--keep-source"], {
      cwd: testDir,
      stdout: "pipe",
      stderr: "pipe",
    });

    const output = await new Response(proc.stdout).text();
    await proc.exited;

    expect(proc.exitCode).toBe(0);
    expect(output).toContain("Converting");
    expect(output).toContain("file(s)");
    expect(output).toContain("✓ diagram.mmd");
    expect(output).toContain("✓ flowchart.mermaid");

    const diagramExists = await Bun.file(join(testDir, "diagram.md")).exists();
    const flowchartExists = await Bun.file(
      join(testDir, "flowchart.md"),
    ).exists();
    expect(diagramExists).toBe(true);
    expect(flowchartExists).toBe(true);
  });

  test("prints config", async () => {
    const proc = spawn(["bun", cliPath, "test", "--print-config"], {
      stdout: "pipe",
      stderr: "pipe",
    });

    const output = await new Response(proc.stdout).text();
    await proc.exited;

    expect(proc.exitCode).toBe(0);
    expect(output).toContain('"extension"');
    expect(output).toContain('"keepSource"');

    // Verify it's valid JSON
    const config = JSON.parse(output);
    expect(config).toHaveProperty("extension");
    expect(config).toHaveProperty("keepSource");
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
    expect(output).toContain("0.1.0");
  });

  describe("validate subcommand", () => {
    test("validates valid config file", async () => {
      const configPath = join(testDir, "valid-config.yaml");
      await writeFile(configPath, `header: "Test header"\nkeepSource: true`);

      const proc = spawn(["bun", cliPath, "validate", configPath], {
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
          extension: 123, // Should be string
          keepSource: "yes", // Should be boolean
        }),
      );

      const proc = spawn(["bun", cliPath, "validate", configPath], {
        cwd: testDir,
        stdout: "pipe",
        stderr: "pipe",
      });

      const stderr = await new Response(proc.stderr).text();
      await proc.exited;

      expect(proc.exitCode).toBe(1);
      expect(stderr).toContain("❌ Invalid config:");
      expect(stderr).toContain("extension:");
      expect(stderr).toContain("keepSource:");
    });

    test("validates config when no file is specified", async () => {
      // Create default config file
      const configPath = join(testDir, ".mermaid-markdown-wraprc.yaml");
      await writeFile(configPath, `footer: "Default footer"`);

      const proc = spawn(["bun", cliPath, "validate"], {
        cwd: testDir,
        stdout: "pipe",
        stderr: "pipe",
      });

      const output = await new Response(proc.stdout).text();
      await proc.exited;

      expect(proc.exitCode).toBe(0);
      expect(output).toContain("✅ Config looks good!");
    });

    test("handles missing config file gracefully", async () => {
      const proc = spawn(["bun", cliPath, "validate", "nonexistent.yaml"], {
        cwd: testDir,
        stdout: "pipe",
        stderr: "pipe",
      });

      const output = await new Response(proc.stdout).text();
      await proc.exited;

      // Should pass validation when no config is found (empty config is valid)
      expect(proc.exitCode).toBe(0);
      expect(output).toContain("✅ Config looks good!");
    });
  });
});
