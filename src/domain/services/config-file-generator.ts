/**
 * Config file generator service
 *
 * This service generates configuration file content in various formats
 * for the mermaid-markdown-wrap CLI tool.
 */

import { stringify as toYAML } from "yaml";
import { getPackageName } from "../constants/package-info.js";
import type { ConfigOptions } from "../models/options.js";

/**
 * Supported configuration file formats
 */
export type ConfigFormat = "ts" | "js" | "cjs" | "mjs" | "json" | "yaml";

/**
 * Configuration file format information
 */
export interface ConfigFormatInfo {
  format: ConfigFormat;
  label: string;
  value: ConfigFormat;
}

/**
 * Available configuration formats
 */
export const CONFIG_FORMATS: ConfigFormatInfo[] = [
  { format: "ts", label: "TypeScript (.ts)", value: "ts" },
  { format: "js", label: "JavaScript  (.js)", value: "js" },
  { format: "cjs", label: "CommonJS    (.cjs)", value: "cjs" },
  { format: "mjs", label: "ESM         (.mjs)", value: "mjs" },
  { format: "json", label: "JSON        (.json)", value: "json" },
  { format: "yaml", label: "YAML        (.yaml)", value: "yaml" },
];

/**
 * Generate configuration file name based on format
 */
export function generateConfigFileName(format: ConfigFormat): string {
  const packageName = getPackageName();

  switch (format) {
    case "ts":
      return `${packageName}.config.ts`;

    case "js":
      return `${packageName}.config.js`;

    case "cjs":
      return `${packageName}.config.cjs`;

    case "mjs":
      return `${packageName}.config.mjs`;

    case "json":
      return `.${packageName}rc.json`;

    case "yaml":
      return `.${packageName}rc.yaml`;

    default:
      // This should never happen due to TypeScript, but satisfy exhaustiveness check
      throw new Error(`Unsupported format: ${format}`);
  }
}

/**
 * Generate configuration file content based on format
 */
export function generateConfigFileContent(
  config: ConfigOptions,
  format: ConfigFormat,
): string {
  // Convert config to JSON string with proper formatting
  const jsonContent = JSON.stringify(config, null, 2);

  switch (format) {
    case "ts":
      return generateTypeScriptConfig(jsonContent);
    case "js":
      return generateJavaScriptConfig(jsonContent);
    case "cjs":
      return generateCommonJSConfig(jsonContent);
    case "mjs":
      return generateESMConfig(jsonContent);
    case "json": {
      // Add $schema property for JSON format
      const configWithSchema = {
        $schema:
          "https://unpkg.com/mermaid-markdown-wrap/schema/config.schema.json",
        ...config,
      };
      return JSON.stringify(configWithSchema, null, 2);
    }
    case "yaml":
      return toYAML(config);
    default:
      // This should never happen due to TypeScript, but satisfy exhaustiveness check
      throw new Error(`Unsupported format: ${format}`);
  }
}

/**
 * Generate TypeScript configuration
 */
function generateTypeScriptConfig(jsonContent: string): string {
  const packageName = getPackageName();
  return `import { defineConfig } from '${packageName}/config';

export default defineConfig(${jsonContent});
`;
}

/**
 * Generate JavaScript configuration (module.exports)
 */
function generateJavaScriptConfig(jsonContent: string): string {
  const packageName = getPackageName();
  return `/** @type {import('${packageName}/config').ConfigOptions} */
module.exports = ${jsonContent};
`;
}

/**
 * Generate CommonJS configuration
 */
function generateCommonJSConfig(jsonContent: string): string {
  const packageName = getPackageName();
  return `/** @type {import('${packageName}/config').ConfigOptions} */
module.exports = ${jsonContent};
`;
}

/**
 * Generate ESM configuration
 */
function generateESMConfig(jsonContent: string): string {
  const packageName = getPackageName();
  return `/** @type {import('${packageName}/config').ConfigOptions} */
export default ${jsonContent};
`;
}
