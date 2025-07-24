import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import { mkdir, readFile, rmdir, unlink, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { spawn } from "bun";

const testDir = join(import.meta.dir, "../../test-cli-temp");
const cliPath = join(import.meta.dir, "index.ts");

describe("CLI", () => {
  beforeEach(async () => {
    await mkdir(testDir, { recursive: true });
  });

  afterEach(async () => {
    // Clean up test directory
    try {
      const glob = new Bun.Glob("**/*");
      const files = await Array.fromAsync(
        glob.scan({ cwd: testDir, onlyFiles: true }),
      );
      for (const file of files) {
        try {
          await unlink(join(testDir, file));
        } catch {}
      }
      await rmdir(testDir);
    } catch {}
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
});
