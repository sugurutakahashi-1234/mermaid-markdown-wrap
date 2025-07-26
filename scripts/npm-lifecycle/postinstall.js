#!/usr/bin/env node

// Only show message when installed as a dependency, not during development
if (
  !process.env.npm_config_save_dev &&
  process.env.npm_config_production !== "false"
) {
  console.log("\n🧙 Thanks for installing mermaid-markdown-wrap!");
  console.log("\nTo get started:");
  console.log(
    '  1. Run "npx mermaid-markdown-wrap init" to create a config file',
  );
  console.log(
    "  2. Then run \"npx mermaid-markdown-wrap '**/*.mmd'\" to convert your files",
  );
  console.log(
    "\nFor more information: https://github.com/sugurutakahashi-1234/mermaid-markdown-wrap\n",
  );
}
