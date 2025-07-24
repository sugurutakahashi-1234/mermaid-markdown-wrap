#!/usr/bin/env bun
import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Get the project root directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "..");

const schemaPath = join(projectRoot, "schema", "config.schema.json");

try {
  // Try to read the schema file
  const schemaContent = await readFile(schemaPath, "utf-8");
  const schema = JSON.parse(schemaContent);

  // Check if schema has required fields
  if (!schema.$schema || !schema.$id) {
    console.error("❌ Schema is missing required metadata fields");
    process.exit(1);
  }

  console.log("✅ Schema file exists and is valid");

  // Run generate-schema.ts and check if the content changes
  const { $ } = await import("bun");
  await $`bun run generate:schema`;

  // Read the schema again
  const newSchemaContent = await readFile(schemaPath, "utf-8");

  if (schemaContent !== newSchemaContent) {
    console.error(
      "❌ Schema is out of date. Please run 'bun run generate:schema'",
    );
    process.exit(1);
  }

  console.log("✅ Schema is up to date");
} catch (error) {
  console.error("❌ Schema check failed:", error);
  process.exit(1);
}
