# Configuration File Format Examples

This directory demonstrates all supported configuration file formats for `mermaid-markdown-wrap`.

## Supported Formats

1. **JavaScript (ES Module)** - `mermaid-markdown-wrap.config.js`
2. **CommonJS** - `mermaid-markdown-wrap.config.cjs`
3. **ES Module (.mjs)** - `mermaid-markdown-wrap.config.mjs`
4. **JSON** - `mermaid-markdown-wrap.config.json`
5. **YAML (.yml)** - `mermaid-markdown-wrap.config.yml`
6. **YAML (.yaml)** - `mermaid-markdown-wrap.config.yaml`

## Testing Each Format

Each configuration file in this directory contains the same settings but with different headers to identify which format was used:

```bash
# Test each config format individually
cd config-formats

# JavaScript ES Module
bunx mermaid-markdown-wrap test.mmd --config mermaid-markdown-wrap.config.js

# CommonJS
bunx mermaid-markdown-wrap test.mmd --config mermaid-markdown-wrap.config.cjs

# ES Module with .mjs
bunx mermaid-markdown-wrap test.mmd --config mermaid-markdown-wrap.config.mjs

# JSON
bunx mermaid-markdown-wrap test.mmd --config mermaid-markdown-wrap.config.json

# YAML with .yml
bunx mermaid-markdown-wrap test.mmd --config mermaid-markdown-wrap.config.yml

# YAML with .yaml
bunx mermaid-markdown-wrap test.mmd --config mermaid-markdown-wrap.config.yaml
```

## Configuration Structure

All formats support the same options:

```javascript
// JavaScript/CommonJS/MJS format
{
  outDir: 'output/config-test',
  extension: '.md',
  header: 'Header text here',
  footer: 'Footer text here',
  keepSource: true
}
```

```json
// JSON format
{
  "outDir": "output/config-test",
  "extension": ".md",
  "header": "Header text here",
  "footer": "Footer text here",
  "keepSource": true
}
```

```yaml
# YAML format
outDir: output/config-test
extension: .md
header: |
  Header text here
footer: |
  Footer text here
keepSource: true
```

## Auto-detection

The tool uses [cosmiconfig](https://github.com/davidtheclark/cosmiconfig) to automatically detect and load configuration files. It searches for:

1. `mermaid-markdown-wrap.config.{js,cjs,mjs,json,yml,yaml}`
2. `.mermaid-markdown-wraprc`
3. `.mermaid-markdown-wraprc.{json,yml,yaml}`
4. `mermaid-markdown-wrap` field in `package.json`

The search starts from the current directory and moves up the directory tree until a config file is found.

## Priority

When multiple config sources are present:

1. CLI arguments (highest priority)
2. Config file specified with `--config`
3. Auto-detected config file
4. Default values (lowest priority)

## Multi-line Strings

For multi-line headers and footers:

- **JavaScript/JSON**: Use `\n` for line breaks
- **YAML**: Use the pipe (`|`) character for literal multi-line strings