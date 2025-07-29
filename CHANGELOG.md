# Changelog

## [1.2.1](https://github.com/sugurutakahashi-1234/mermaid-markdown-wrap/compare/v1.2.0...v1.2.1) (2025-07-29)


### ♻️ Code Refactoring

* replace GitHub Script with gh CLI for PR comments ([#19](https://github.com/sugurutakahashi-1234/mermaid-markdown-wrap/issues/19)) ([f8ee7cd](https://github.com/sugurutakahashi-1234/mermaid-markdown-wrap/commit/f8ee7cdcd44e81b4bc393f34cd25591b24c21a73))

## [1.2.0](https://github.com/sugurutakahashi-1234/mermaid-markdown-wrap/compare/v1.1.1...v1.2.0) (2025-07-29)


### ✨ Features

* trigger test workflows after npm release via workflow_run event ([#17](https://github.com/sugurutakahashi-1234/mermaid-markdown-wrap/issues/17)) ([763bfcc](https://github.com/sugurutakahashi-1234/mermaid-markdown-wrap/commit/763bfcc06787f0c3dd34e8ddc31192d9bbd1affe))

## [1.1.1](https://github.com/sugurutakahashi-1234/mermaid-markdown-wrap/compare/v1.1.0...v1.1.1) (2025-07-29)


### 🐛 Bug Fixes

* use source code for PRs to main branch in CI tests ([#16](https://github.com/sugurutakahashi-1234/mermaid-markdown-wrap/issues/16)) ([98e3ed0](https://github.com/sugurutakahashi-1234/mermaid-markdown-wrap/commit/98e3ed01c310d9dead802820ad27adcd8edaca13))


### 📚 Documentation

* add --log-format json to README examples ([#15](https://github.com/sugurutakahashi-1234/mermaid-markdown-wrap/issues/15)) ([7a1fc6b](https://github.com/sugurutakahashi-1234/mermaid-markdown-wrap/commit/7a1fc6b153d4081f2a999ad2ea62fc9ffaca9594))
* update README badge and remove unused peerDependencies ([#13](https://github.com/sugurutakahashi-1234/mermaid-markdown-wrap/issues/13)) ([9bccce5](https://github.com/sugurutakahashi-1234/mermaid-markdown-wrap/commit/9bccce58657e9ceb39a874a5e8f5de436eb89ba0))

## [1.1.0](https://github.com/sugurutakahashi-1234/mermaid-markdown-wrap/compare/v1.0.0...v1.1.0) (2025-07-28)


### ✨ Features

* reorganize CI workflows and enhance test coverage ([#12](https://github.com/sugurutakahashi-1234/mermaid-markdown-wrap/issues/12)) ([9277e4e](https://github.com/sugurutakahashi-1234/mermaid-markdown-wrap/commit/9277e4e799c9d92ee5650f5f9dc9d196ce0b0d1d))


### 🐛 Bug Fixes

* remove --yes flag from npx command in GitHub Action ([#8](https://github.com/sugurutakahashi-1234/mermaid-markdown-wrap/issues/8)) ([42e495f](https://github.com/sugurutakahashi-1234/mermaid-markdown-wrap/commit/42e495fc4bcc6f77be444fd146788b7ba8ef5f8e))


### 🔧 Maintenance

* add debug information for GitHub Action npx issue ([#10](https://github.com/sugurutakahashi-1234/mermaid-markdown-wrap/issues/10)) ([68296bb](https://github.com/sugurutakahashi-1234/mermaid-markdown-wrap/commit/68296bb65955f77cc7ff2eca8ceda4996c85ab44))
* enhance debug output for npx execution failure ([#11](https://github.com/sugurutakahashi-1234/mermaid-markdown-wrap/issues/11)) ([de0f911](https://github.com/sugurutakahashi-1234/mermaid-markdown-wrap/commit/de0f9110b2e1754fb7b43425547f79530956804b))

## [1.0.0](https://github.com/sugurutakahashi-1234/mermaid-markdown-wrap/compare/v0.2.0...v1.0.0) (2025-07-27)


### ✨ Features

* add manual force version bump workflow ([#7](https://github.com/sugurutakahashi-1234/mermaid-markdown-wrap/issues/7)) ([5e66e53](https://github.com/sugurutakahashi-1234/mermaid-markdown-wrap/commit/5e66e53811ad8f6a5a7a24d13d7ace8c433b5c42))
* add mermaid code block extraction to prevent double-wrapping ([#5](https://github.com/sugurutakahashi-1234/mermaid-markdown-wrap/issues/5)) ([83c6b76](https://github.com/sugurutakahashi-1234/mermaid-markdown-wrap/commit/83c6b7681ce89dd79481ee7692026f351a58c33e))


### 🔧 Maintenance

* bump version to 1.0.0 ([4eab485](https://github.com/sugurutakahashi-1234/mermaid-markdown-wrap/commit/4eab4858429439cd7450f2c89df8e3b7e49a7a4a))

## [0.2.0](https://github.com/sugurutakahashi-1234/mermaid-markdown-wrap/compare/v0.1.0...v0.2.0) (2025-07-27)


### ✨ Features

* add command info generation and update CLI options [deps-change] ([5f8bed5](https://github.com/sugurutakahashi-1234/mermaid-markdown-wrap/commit/5f8bed538fd24152e5213a5a15ded5cdec80675b))
* add configuration commands and update CLI options ([04a550e](https://github.com/sugurutakahashi-1234/mermaid-markdown-wrap/commit/04a550eb37d079b883b0e55675579b33a697c318))
* add configuration file format examples [deps-change] ([a229ba8](https://github.com/sugurutakahashi-1234/mermaid-markdown-wrap/commit/a229ba8415ec3c13afd49d69741eb5fd7fc117f3))
* add configuration use cases for showing and validating [deps-change] ([8c189c1](https://github.com/sugurutakahashi-1234/mermaid-markdown-wrap/commit/8c189c1c254555af2f6274fc43e6ed984b037637))
* add configuration validation command [deps-change] ([8db4261](https://github.com/sugurutakahashi-1234/mermaid-markdown-wrap/commit/8db4261a5354cabf5141e96bb3cf6ddca39a0aab))
* add end-to-end testing script for npm package ([07705a2](https://github.com/sugurutakahashi-1234/mermaid-markdown-wrap/commit/07705a24080867097a0a8212c6b67c6f19c0d23c))
* add interactive configuration initialization [deps-change] ([8d7985f](https://github.com/sugurutakahashi-1234/mermaid-markdown-wrap/commit/8d7985f4bcad82c1c40546e3bc5294042bedba77))
* add Japanese README and enhance configuration documentation ([142d153](https://github.com/sugurutakahashi-1234/mermaid-markdown-wrap/commit/142d153bfa918f7b5df8397c17dd78571f8a05c8))
* add JSON Schema support and configuration files [deps-change] ([0f24739](https://github.com/sugurutakahashi-1234/mermaid-markdown-wrap/commit/0f2473966d940da6fc9da0c9730ade6182526e04))
* add log output format and quiet options ([9a299bf](https://github.com/sugurutakahashi-1234/mermaid-markdown-wrap/commit/9a299bffa4ed39ee2537d86f1b9f008d4de8a78c))
* add option to hide command in output ([6494d72](https://github.com/sugurutakahashi-1234/mermaid-markdown-wrap/commit/6494d72d32f8ecb4037bb2ef05fd513b742df579))
* add TypeScript configuration support and project restructuring ([62ac7a3](https://github.com/sugurutakahashi-1234/mermaid-markdown-wrap/commit/62ac7a3112df6e927e744435d90b01269acb2fa4))
* enhance file processing and CLI options validation ([e04f831](https://github.com/sugurutakahashi-1234/mermaid-markdown-wrap/commit/e04f8310655dd6e21354fa948fb5b397185abba4))
* implement CLI options and file processing [deps-change] ([6b9c0c8](https://github.com/sugurutakahashi-1234/mermaid-markdown-wrap/commit/6b9c0c8986f3e6ca5e7055af816c35c9110dd3ed))
* implement CLI tool with configuration and file processing [deps-change] ([cc82686](https://github.com/sugurutakahashi-1234/mermaid-markdown-wrap/commit/cc82686e65260f4bc4a55742535d216dea246edf))
* initialize TypeScript project with essential configurations and scripts ([3479cb1](https://github.com/sugurutakahashi-1234/mermaid-markdown-wrap/commit/3479cb17d1bdc68a41a7b8d709e3881ddadf2a3d))
* remove result checker service and update CLI logic ([0878bc8](https://github.com/sugurutakahashi-1234/mermaid-markdown-wrap/commit/0878bc87275435573877d1d1a3f93b8f5d0688cc))
* support .mermaid files in conversion ([0e74560](https://github.com/sugurutakahashi-1234/mermaid-markdown-wrap/commit/0e7456001e8e5cdb180fcf9ba4967c97d0d41d11))
* update build scripts and add schema validation ([8e0dfce](https://github.com/sugurutakahashi-1234/mermaid-markdown-wrap/commit/8e0dfce96bb5d0d7353853d49aa81603529a1608))
* update CLI input handling and configuration options ([c83850b](https://github.com/sugurutakahashi-1234/mermaid-markdown-wrap/commit/c83850b622a4d5733493b8c88419f2128a76f223))
* update dependencies and improve interactive prompts [deps-change] ([f2ab329](https://github.com/sugurutakahashi-1234/mermaid-markdown-wrap/commit/f2ab329964f245d355db2bff6966c9d889ecbe1d))


### 📚 Documentation

* add status badges to README ([#2](https://github.com/sugurutakahashi-1234/mermaid-markdown-wrap/issues/2)) ([a5cdb50](https://github.com/sugurutakahashi-1234/mermaid-markdown-wrap/commit/a5cdb50c7647a00d70e988b4b91ff9652ddc26e7))
* update contributing guidelines and improve README ([b95a9f5](https://github.com/sugurutakahashi-1234/mermaid-markdown-wrap/commit/b95a9f5c636863a520376cd86d693a5fb919dda7))


### ♻️ Code Refactoring

* configuration handling and update option schemas [deps-change] ([45ee4aa](https://github.com/sugurutakahashi-1234/mermaid-markdown-wrap/commit/45ee4aa13a2f646efffd74fdd770d8b2d2bb1020))
* file conversion use case and output handling ([278e132](https://github.com/sugurutakahashi-1234/mermaid-markdown-wrap/commit/278e1321526c4158152370f8482e7bf743a229d3))
* improve configuration validation and error handling [deps-change] ([36cb013](https://github.com/sugurutakahashi-1234/mermaid-markdown-wrap/commit/36cb01313a5b79193d6daa281454662b0ae4b9b1))
* remove file extension option from configuration ([88362de](https://github.com/sugurutakahashi-1234/mermaid-markdown-wrap/commit/88362de0e43f6944bd36f1affa42733bcf43df18))
* remove file extension option from configuration ([571d2df](https://github.com/sugurutakahashi-1234/mermaid-markdown-wrap/commit/571d2dfe5446a42fb5c603adf7cfc95c4f2057ee))
* rename keep-source option to remove-source ([201a6c7](https://github.com/sugurutakahashi-1234/mermaid-markdown-wrap/commit/201a6c78a04e063267e11ebe59fbfdd4ec63a974))
* replace `--no-show-command` with `--hide-command` ([749e449](https://github.com/sugurutakahashi-1234/mermaid-markdown-wrap/commit/749e449b5b6a7702ef17ce6e10193de71a91d44f))
* restructure domain [deps-change] ([48df372](https://github.com/sugurutakahashi-1234/mermaid-markdown-wrap/commit/48df3720c6c1b2619677761367de5f368a523486))
* streamline configuration validation process [deps-change] ([e379d9a](https://github.com/sugurutakahashi-1234/mermaid-markdown-wrap/commit/e379d9ae2fa04665639971febf20021b5c637c0f))
* update configuration handling and improve type definitions [deps-change] ([32a5d8d](https://github.com/sugurutakahashi-1234/mermaid-markdown-wrap/commit/32a5d8ddd8f12a22fd469f55d2ba6674918fc68a))
* update configuration options and improve CLI prompts ([d41dca9](https://github.com/sugurutakahashi-1234/mermaid-markdown-wrap/commit/d41dca9a3f304cabec15df6b6fad8176bfcb5f4a))
* update Node.js version and remove obsolete tests ([fab4cc1](https://github.com/sugurutakahashi-1234/mermaid-markdown-wrap/commit/fab4cc172730b3217ba61f801b40ea14d5c959eb))
* update pre-commit validation for schema changes ([d5b54d7](https://github.com/sugurutakahashi-1234/mermaid-markdown-wrap/commit/d5b54d73479cd7d02c5fc8974e4c0360d19c9c30))


### ✅ Tests

* add CLI tests for file conversion and configuration validation ([819572f](https://github.com/sugurutakahashi-1234/mermaid-markdown-wrap/commit/819572f9e9db1fa9c5db94219c06a640ebac7af7))
* make version test dynamic instead of hardcoded ([#4](https://github.com/sugurutakahashi-1234/mermaid-markdown-wrap/issues/4)) ([0779778](https://github.com/sugurutakahashi-1234/mermaid-markdown-wrap/commit/0779778fb24e20beeeab1f1f2910f29cb72e107a))


### 📦 Build System

* update dependencies in package.json ([eadcda2](https://github.com/sugurutakahashi-1234/mermaid-markdown-wrap/commit/eadcda2e0dd05786fbd2a03bfd89f25579005e21))


### 👷 CI/CD

* add integration test workflow for GitHub Action ([0b7472d](https://github.com/sugurutakahashi-1234/mermaid-markdown-wrap/commit/0b7472da99fbd1d20aa76f586f02a8312c096ecf))
* update integration test workflow to use local action ([f5d62b4](https://github.com/sugurutakahashi-1234/mermaid-markdown-wrap/commit/f5d62b4a2e54747ee5f5552c4b73c302a8515994))


### 🔧 Maintenance

* remove example files and configuration formats ([fa25e2c](https://github.com/sugurutakahashi-1234/mermaid-markdown-wrap/commit/fa25e2ca2bfffe1e30b65efc0338226d82377949))
* remove notification sound instructions from guidance ([c7aa9b7](https://github.com/sugurutakahashi-1234/mermaid-markdown-wrap/commit/c7aa9b776d6f8a3e9669e0db46ecb0d1fe9e998e))
