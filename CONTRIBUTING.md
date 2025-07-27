# Contributing

Thank you for your interest in contributing to mermaid-markdown-wrap!

## Ways to Contribute

There are several ways to contribute to this project:

- 🐛 **Report bugs**: Let us know if something isn't working
- 💡 **Suggest features**: Share ideas for new functionality
- 📝 **Improve documentation**: Help make our docs clearer
- 🔧 **Submit code**: Fix bugs or add features
- 🧪 **Write tests**: Improve test coverage
- 🌏 **Translate**: Help with internationalization

## Development Setup

### Prerequisites

- Node.js v20 or higher
- [Bun](https://bun.sh/) (latest version)

### Getting Started

```bash
# 1. Fork and clone the repository
git clone https://github.com/YOUR_USERNAME/mermaid-markdown-wrap.git
cd mermaid-markdown-wrap

# 2. Install dependencies
bun install

# 3. Run tests to verify setup
bun test

# 4. Start developing
bun run dev
```

### Code Quality

Before submitting, ensure your code passes all checks:

```bash
# Run all CI checks
bun run ci

# Or run individually:
bun run lint      # Fix linting issues
bun run typecheck # Type checking
bun run test      # Run tests
```

## Pull Request Process

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (see commit conventions below)
4. **Push** to your fork (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Commit Conventions

We use [conventional commits](https://www.conventionalcommits.org/):

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `refactor:` Code refactoring
- `test:` Test additions/updates
- `chore:` Maintenance tasks

Examples:
```
feat: add support for custom output formats
fix: handle empty mermaid files correctly
docs: update installation instructions
```

## Need Help?

- 💬 Open a [GitHub Issue](https://github.com/sugurutakahashi-1234/mermaid-markdown-wrap/issues)
- 📧 Contact the maintainer: [@ikuraikuraaaaaa](https://twitter.com/ikuraikuraaaaaa) on X/Twitter

## Community Guidelines

- Be respectful and inclusive
- Focus on what's best for the community
- Show empathy towards other contributors

Thank you for contributing! 🎉