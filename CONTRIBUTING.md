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

- Node.js v26 or higher
- [Bun](https://bun.sh/) (latest version)

### Getting Started

```bash
# 1. Fork and clone the repository
git clone https://github.com/YOUR_USERNAME/mermaid-markdown-wrap.git
cd mermaid-markdown-wrap

# 2. Install dependencies
bun install

# For macOS users with Homebrew: Install additional tools
# (Required for building binaries and managing releases)
brew bundle

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
- 📧 Contact the maintainer: [@suguru_takaha4](https://x.com/suguru_takaha4) on X/Twitter

## Community Guidelines

- Be respectful and inclusive
- Focus on what's best for the community
- Show empathy towards other contributors

Thank you for contributing! 🎉

## Releasing to npm

1. Merge the tested change into `main` with a Conventional Commit title. Mark a breaking change with `!` (for example, `feat!:`) or a `BREAKING CHANGE:` footer.
2. Review the version and changelog in the draft `chore: release v… [release-please]` PR. Mark it ready and merge it after the checks pass.
3. Open the [npm Release workflow](.github/workflows/cd-npm-release.yml). It creates the GitHub release and publishes via npm Trusted Publishing using GitHub Actions OIDC.
4. Confirm the new version with `npm view mermaid-markdown-wrap@latest version`. If publication fails, inspect the **Publish to npm** step and check which versions already exist on npm before retrying.

The **Published Tests** workflow also exercises the released CLI and GitHub Action.
