# Mermaid Markdown Wrap Examples

This directory demonstrates all features and options of the `mermaid-markdown-wrap` CLI tool using a single Mermaid diagram file.

## Directory Structure

```
examples/
├── diagram.mmd                         # Single source Mermaid file
├── mermaid-markdown-wrap.config.yaml   # Configuration file example
├── config-formats/                     # All supported config file formats
│   ├── test.mmd                       # Test file for config format examples
│   ├── mermaid-markdown-wrap.config.js
│   ├── mermaid-markdown-wrap.config.cjs
│   ├── mermaid-markdown-wrap.config.mjs
│   ├── mermaid-markdown-wrap.config.json
│   ├── mermaid-markdown-wrap.config.yml
│   └── mermaid-markdown-wrap.config.yaml
├── run-all-examples.sh                 # Script to run all examples (optional)
└── output/                             # Output directory with various patterns
    ├── basic/                          # Basic conversion
    ├── with-header-footer/             # Custom header and footer
    ├── custom-extension/               # Different file extensions
    ├── from-config/                    # Using configuration file
    ├── no-delete/                      # Keep source files
    ├── glob-patterns/                  # Glob pattern examples
    └── multi-options/                  # Combined options
```

## Prerequisites

Ensure the package is built:

```bash
# From project root
bun install
bun run build
```

## All Command Examples

### 1. Basic Conversion

```bash
# Simple conversion (deletes source file)
bunx mermaid-markdown-wrap diagram.mmd

# With explicit output directory
bunx mermaid-markdown-wrap diagram.mmd --out-dir output/basic

# Keep source file
bunx mermaid-markdown-wrap diagram.mmd --out-dir output/basic --keep-source
```

### 2. Glob Pattern Examples

```bash
# All .mmd files in current directory
bunx mermaid-markdown-wrap "*.mmd" --out-dir output/glob-patterns --keep-source

# All .mmd files recursively
bunx mermaid-markdown-wrap "**/*.mmd" --out-dir output/glob-patterns --keep-source

# Multiple specific files
bunx mermaid-markdown-wrap "{diagram,test,example}.mmd" --out-dir output/glob-patterns --keep-source

# Using --glob option explicitly
bunx mermaid-markdown-wrap --glob "*.mmd" --out-dir output/glob-patterns --keep-source

# Complex glob pattern
bunx mermaid-markdown-wrap "**/diagrams/*.mmd" --out-dir output/glob-patterns --keep-source
```

### 3. Header and Footer Options

```bash
# Simple header and footer
bunx mermaid-markdown-wrap diagram.mmd \
  --header "# Documentation" \
  --footer "_Generated diagram_" \
  --out-dir output/with-header-footer \
  --keep-source

# Multi-line header and footer
bunx mermaid-markdown-wrap diagram.mmd \
  --header "# Process Flow\n\n> This diagram shows the application workflow" \
  --footer "\n---\n_Last updated: $(date)_" \
  --out-dir output/with-header-footer \
  --keep-source

# Markdown formatted header/footer
bunx mermaid-markdown-wrap diagram.mmd \
  --header "<!-- Generated: $(date -u +%Y-%m-%dT%H:%M:%SZ) -->\n\n# System Architecture" \
  --footer "\n## Notes\n\n- Auto-generated\n- Do not edit manually" \
  --out-dir output/with-header-footer \
  --keep-source
```

### 4. Custom Extension Examples

```bash
# Markdown documentation format
bunx mermaid-markdown-wrap diagram.mmd \
  --extension .mdoc \
  --out-dir output/custom-extension \
  --keep-source

# Alternative markdown extension
bunx mermaid-markdown-wrap diagram.mmd \
  --extension .markdown \
  --out-dir output/custom-extension \
  --keep-source

# Custom extension for wiki
bunx mermaid-markdown-wrap diagram.mmd \
  --extension .wiki.md \
  --out-dir output/custom-extension \
  --keep-source
```

### 5. Configuration File Usage

```bash
# Auto-detect config file in current directory
bunx mermaid-markdown-wrap diagram.mmd

# Specify config file explicitly
bunx mermaid-markdown-wrap diagram.mmd \
  --config mermaid-markdown-wrap.config.yaml

# Override config file options
bunx mermaid-markdown-wrap diagram.mmd \
  --config mermaid-markdown-wrap.config.yaml \
  --header "Override header" \
  --keep-source

# Print merged configuration
bunx mermaid-markdown-wrap diagram.mmd --print-config
```

### 6. Combined Options Examples

```bash
# Documentation generation with all options
bunx mermaid-markdown-wrap "*.mmd" \
  --out-dir output/multi-options \
  --extension .doc.md \
  --header "# Auto-Generated Documentation\n\nGenerated: $(date)" \
  --footer "\n---\n\n© $(date +%Y) - Generated with mermaid-markdown-wrap" \
  --keep-source

# CI/CD friendly command
bunx mermaid-markdown-wrap "**/*.mmd" \
  --out-dir dist/docs \
  --header "<!-- CI Build: $BUILD_NUMBER -->" \
  --footer "<!-- Commit: $GIT_COMMIT -->" \
  --keep-source

# Batch processing with custom format
bunx mermaid-markdown-wrap "{flow,sequence,class}*.mmd" \
  --out-dir output/multi-options \
  --extension .generated.md \
  --header "<!-- WARNING: Auto-generated file, do not edit! -->\n" \
  --keep-source
```

### 7. Configuration File Format Examples

The tool supports multiple configuration file formats. All formats below produce the same result:

```bash
# Test with JavaScript config (.js)
cd config-formats
mv mermaid-markdown-wrap.config.js mermaid-markdown-wrap.config.js.bak
cp mermaid-markdown-wrap.config.js.bak mermaid-markdown-wrap.config.js
bunx mermaid-markdown-wrap test.mmd

# Test with CommonJS config (.cjs)
rm mermaid-markdown-wrap.config.js
cp mermaid-markdown-wrap.config.cjs.bak mermaid-markdown-wrap.config.cjs
bunx mermaid-markdown-wrap test.mmd

# Test with ES Module config (.mjs)
rm mermaid-markdown-wrap.config.cjs
cp mermaid-markdown-wrap.config.mjs.bak mermaid-markdown-wrap.config.mjs
bunx mermaid-markdown-wrap test.mmd

# Test with JSON config
rm mermaid-markdown-wrap.config.mjs
cp mermaid-markdown-wrap.config.json.bak mermaid-markdown-wrap.config.json
bunx mermaid-markdown-wrap test.mmd

# Test with YAML config (.yml)
rm mermaid-markdown-wrap.config.json
cp mermaid-markdown-wrap.config.yml.bak mermaid-markdown-wrap.config.yml
bunx mermaid-markdown-wrap test.mmd

# Test with YAML config (.yaml)
rm mermaid-markdown-wrap.config.yml
cp mermaid-markdown-wrap.config.yaml.bak mermaid-markdown-wrap.config.yaml
bunx mermaid-markdown-wrap test.mmd
```

Each config format supports the same options:
- `outDir`: Output directory
- `extension`: Output file extension
- `header`: Header text to prepend
- `footer`: Footer text to append
- `keepSource`: Whether to keep source files

### 8. Special Use Cases

```bash
# Help and version
bunx mermaid-markdown-wrap --help
bunx mermaid-markdown-wrap --version
bunx mermaid-markdown-wrap -V

# Dry run with print config
bunx mermaid-markdown-wrap "*.mmd" --print-config

# Process files in subdirectories
bunx mermaid-markdown-wrap "src/**/*.mmd" \
  --out-dir docs/diagrams \
  --keep-source

# Different output directory structure
bunx mermaid-markdown-wrap "components/*/diagram.mmd" \
  --out-dir "documentation/\$1" \
  --keep-source
```

## Run All Examples

To run all examples at once:

```bash
# Make the script executable
chmod +x run-all-examples.sh

# Run all examples
./run-all-examples.sh
```

Or run them individually from the examples directory:

```bash
cd examples

# Basic example
bunx mermaid-markdown-wrap diagram.mmd --out-dir output/basic --keep-source

# With configuration
bunx mermaid-markdown-wrap diagram.mmd --config mermaid-markdown-wrap.config.yaml

# And so on...
```

## Expected Output

After running the examples, check the `output/` directory to see:

1. **Basic conversion**: Simple Mermaid code block wrapping
2. **With headers/footers**: Enhanced documentation format
3. **Custom extensions**: Files with different extensions
4. **From config**: Output based on configuration file settings
5. **Multiple patterns**: Various combined option results

## Tips

- Always quote glob patterns to prevent shell expansion
- Use `--keep-source` to preserve original `.mmd` files
- Combine with `find` or `fd` for more complex file selection
- Use configuration files for consistent project-wide settings
- The `--print-config` option helps debug configuration issues

## Integration Examples

### GitHub Actions

```yaml
- name: Generate Mermaid Documentation
  run: |
    bunx mermaid-markdown-wrap "docs/**/*.mmd" \
      --out-dir docs \
      --header "<!-- Generated from ${{ github.sha }} -->" \
      --keep-source
```

### Package.json Script

```json
{
  "scripts": {
    "docs:generate": "mermaid-markdown-wrap 'diagrams/**/*.mmd' --out-dir docs/generated --keep-source"
  }
}
```

### Pre-commit Hook

```bash
#!/bin/sh
bunx mermaid-markdown-wrap "**/*.mmd" --keep-source
git add "**/*.md"
```