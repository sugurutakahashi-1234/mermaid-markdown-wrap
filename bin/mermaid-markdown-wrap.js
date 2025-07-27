#!/usr/bin/env node
/**
 * Executable wrapper for mermaid-markdown-wrap CLI
 *
 * This file serves as the npm bin entry point to ensure proper executable
 * permissions are maintained when the package is installed via npm/npx.
 *
 * The actual CLI implementation is in ../dist/index.js
 * This wrapper simply imports and executes the main CLI module.
 *
 * Why this wrapper is necessary:
 * - npm preserves file permissions from the git repository
 * - Build output files (dist/*.js) typically don't have executable permissions
 * - This wrapper file is committed to git with executable permissions (chmod +x)
 * - This ensures the CLI works correctly when installed globally or via npx
 */
import("../dist/index.js");
