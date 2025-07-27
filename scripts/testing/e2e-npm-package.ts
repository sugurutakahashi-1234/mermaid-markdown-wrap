#!/usr/bin/env bun
/**
 * NPM Package E2E Test
 *
 * Tests the complete NPM package lifecycle:
 * 1. Create package with `npm pack`
 * 2. Install globally with `npm install -g`
 * 3. Run CLI commands from global PATH
 * 4. Clean up installation
 */
import { execSync } from "node:child_process";
import {
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

console.log("🧪 Starting npm package E2E test...\n");

const projectRoot = join(import.meta.dir, "..", "..");
const packageJsonPath = join(projectRoot, "package.json");
const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf-8"));
const packageName = packageJson.name;
let packageFile: string | null = null;
let isInstalled = false;
let tempDir: string | null = null;
let npxTestDir: string | null = null;

// Clean up any existing npm installation
try {
  console.log("🧹 Checking for existing npm installation...");
  execSync(`npm uninstall -g ${packageName}`, { stdio: "pipe" });
  console.log("✅ Removed existing npm installation");
} catch {
  // Package not installed, which is fine
  console.log("✅ No existing npm installation found");
}

try {
  // Step 1: Check if built
  const distDir = join(projectRoot, "dist");
  if (!existsSync(distDir)) {
    console.error("❌ Project not built. Please run 'bun run build' first.");
    process.exit(1);
  }

  // Step 2: Create npm package
  console.log("\n📦 Creating npm package...");
  const packOutput = execSync("npm pack", { cwd: projectRoot })
    .toString()
    .trim();
  packageFile = packOutput.split("\n").pop() || ""; // Get the last line (filename)
  console.log(`✅ Created: ${packageFile}`);

  // Check package size
  const sizeOutput = execSync(`npm pack --dry-run --json`, {
    cwd: projectRoot,
  });
  const packInfo = JSON.parse(sizeOutput.toString());
  const sizeMB = packInfo[0].size / (1024 * 1024);
  console.log(`📊 Package size: ${sizeMB.toFixed(2)} MB`);

  if (sizeMB > 1) {
    console.warn(`⚠️  Warning: Package size is large (${sizeMB.toFixed(2)} MB)`);
  }

  // Step 3: Install globally
  console.log("\n📥 Installing package globally...");
  execSync(`npm install -g ${join(projectRoot, packageFile)}`, {
    stdio: "inherit",
  });
  isInstalled = true;

  // Step 4: Test commands
  console.log("\n🧪 Testing commands...");

  // Test version
  console.log("  Testing --version...");
  const version = execSync(`${packageName} --version`).toString().trim();
  console.log(`  ✅ Version: ${version}`);

  // Test help
  console.log("  Testing --help...");
  execSync(`${packageName} --help`, { stdio: "pipe" });
  console.log("  ✅ Help command works");

  // Test actual conversion
  console.log("\n🧪 Testing actual conversion...");
  tempDir = mkdtempSync(join(tmpdir(), "mermaid-test-"));
  const testMmdFile = join(tempDir, "test.mmd");
  const testMermaidContent = `graph TD
    A[Start] --> B[End]`;

  writeFileSync(testMmdFile, testMermaidContent);
  console.log(`  Created test file: ${testMmdFile}`);

  // Run conversion
  execSync(`${packageName} ${testMmdFile}`, { cwd: tempDir, stdio: "pipe" });

  // Check output
  const outputFile = join(tempDir, "test.md");
  if (!existsSync(outputFile)) {
    throw new Error("Output file was not created");
  }

  const outputContent = readFileSync(outputFile, "utf-8");
  if (
    !outputContent.includes("```mermaid") ||
    !outputContent.includes("graph TD")
  ) {
    throw new Error("Output file does not contain expected content");
  }

  // Check that source file was kept (default behavior)
  if (!existsSync(testMmdFile)) {
    throw new Error("Source file should have been kept by default");
  }

  console.log("  ✅ Conversion test passed");

  // Test with --remove-source option
  console.log("\n🧪 Testing --remove-source option...");
  const testMmdFile2 = join(tempDir, "test2.mmd");
  writeFileSync(testMmdFile2, testMermaidContent);

  execSync(`${packageName} ${testMmdFile2} --remove-source`, {
    cwd: tempDir,
    stdio: "pipe",
  });

  if (existsSync(testMmdFile2)) {
    throw new Error(
      "Source file should have been deleted with --remove-source option",
    );
  }
  console.log("  ✅ --remove-source option works");

  // Step 5: Test with npx (using globally installed package)
  console.log("\n🧪 Testing npx execution...");

  // Create a new temp directory for npx test
  npxTestDir = mkdtempSync(join(tmpdir(), "npx-test-"));
  const npxTestFile = join(npxTestDir, "npx-test.mmd");
  writeFileSync(
    npxTestFile,
    `sequenceDiagram
  Alice->>Bob: Hello via npx!`,
  );

  try {
    // Test npx with globally installed package
    console.log("  Testing npx with globally installed package...");
    execSync(`npx ${packageName} ${npxTestFile}`, {
      cwd: npxTestDir,
      stdio: "pipe",
    });

    // Verify output
    const npxOutputFile = join(npxTestDir, "npx-test.md");
    if (!existsSync(npxOutputFile)) {
      throw new Error("npx: Output file was not created");
    }

    const npxOutput = readFileSync(npxOutputFile, "utf-8");
    if (
      !npxOutput.includes("```mermaid") ||
      !npxOutput.includes("sequenceDiagram")
    ) {
      throw new Error("npx: Output file does not contain expected content");
    }

    console.log("  ✅ npx execution works correctly");

    // Test npx with package name after uninstalling global
    console.log("  Testing npx without global install (cache test)...");
    const npxTestFile2 = join(npxTestDir, "npx-test2.mmd");
    writeFileSync(npxTestFile2, "graph TD\n  X-->Y");

    // Uninstall global to test npx cache
    execSync(`npm uninstall -g ${packageName}`, { stdio: "pipe" });
    isInstalled = false;

    // npx should still work from cache
    execSync(`npx ${packageName} ${npxTestFile2} --quiet`, {
      cwd: npxTestDir,
      stdio: "pipe",
    });

    if (!existsSync(join(npxTestDir, "npx-test2.md"))) {
      throw new Error("npx cache test: Output file was not created");
    }

    console.log("  ✅ npx cache execution works correctly");
  } finally {
    // Cleanup npx test directory will be done in the main cleanup section
  }

  console.log("\n✅ All tests passed!");
} catch (error) {
  console.error(
    "\n❌ Test failed:",
    error instanceof Error ? error.message : error,
  );
  process.exit(1);
} finally {
  // Cleanup
  console.log("\n🧹 Cleaning up...");

  if (isInstalled) {
    try {
      execSync(`npm uninstall -g ${packageName}`, { stdio: "pipe" });
      console.log("✅ npm package uninstalled");
    } catch {
      console.warn("⚠️  Failed to uninstall npm package");
    }
  }

  if (packageFile && existsSync(join(projectRoot, packageFile))) {
    rmSync(join(projectRoot, packageFile));
    console.log("✅ Package file removed");
  }

  if (tempDir && existsSync(tempDir)) {
    rmSync(tempDir, { recursive: true });
    console.log("✅ Temporary directory removed");
  }

  if (npxTestDir && existsSync(npxTestDir)) {
    rmSync(npxTestDir, { recursive: true });
    console.log("✅ npx test directory removed");
  }
}

console.log("\n✨ E2E test completed!");
