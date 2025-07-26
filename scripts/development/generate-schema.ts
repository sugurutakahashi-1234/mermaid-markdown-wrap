#!/usr/bin/env bun
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { toJsonSchema } from "@valibot/to-json-schema";
import { ConfigOptionsSchema } from "../../src/domain/models/options.js";

// Get the project root directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, "..", "..");

// Generate JSON Schema from the same schema used for runtime validation
const jsonSchema = toJsonSchema(ConfigOptionsSchema, {
  errorMode: "throw",
});

// Add metadata to the schema
const schemaWithMetadata = {
  $schema: "http://json-schema.org/draft-07/schema#",
  $id: "https://unpkg.com/mermaid-markdown-wrap/schema/config.schema.json",
  title: "Mermaid Markdown Wrap Configuration",
  description: "Configuration options for mermaid-markdown-wrap CLI tool",
  ...jsonSchema,
};

// Create schema directory and write the file
const schemaDir = join(projectRoot, "schema");
const schemaPath = join(schemaDir, "config.schema.json");

try {
  await mkdir(schemaDir, { recursive: true });
  await writeFile(
    schemaPath,
    `${JSON.stringify(schemaWithMetadata, null, 2)}\n`,
  );
  console.log(`✅ JSON Schema generated successfully at: ${schemaPath}`);
} catch (error) {
  console.error("❌ Failed to generate JSON Schema:", error);
  process.exit(1);
}
