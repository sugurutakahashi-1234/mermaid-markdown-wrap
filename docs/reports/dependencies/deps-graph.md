# TypeScript Graph

```bash
tsg --tsconfig tsconfig.build.json --LR --md docs/reports/dependencies/deps-graph.md
```

```mermaid
flowchart LR
    subgraph src["src"]
        src/index.ts["index.ts"]
        subgraph src/domain["/domain"]
            subgraph src/domain/models["/models"]
                src/domain/models/options.ts["options.ts"]
                src/domain/models/result.ts["result.ts"]
                src/domain/models/errors.ts["errors.ts"]
            end
            subgraph src/domain/services["/services"]
                src/domain/services/cli//options//parser.ts["cli-options-parser.ts"]
                src/domain/services/options//merger.ts["options-merger.ts"]
                src/domain/services/command//info//generator.ts["command-info-generator.ts"]
                src/domain/services/mermaid//formatter.ts["mermaid-formatter.ts"]
                src/domain/services/path//calculator.ts["path-calculator.ts"]
                src/domain/services/config//file//generator.ts["config-file-generator.ts"]
            end
            subgraph src/domain/constants["/constants"]
                src/domain/constants/package//info.ts["package-info.ts"]
            end
        end
        subgraph src/infrastructure["/infrastructure"]
            subgraph src/infrastructure/adapters["/adapters"]
                src/infrastructure/adapters/cosmiconfig.adapter.ts["cosmiconfig.adapter.ts"]
                src/infrastructure/adapters/file//system.adapter.ts["file-system.adapter.ts"]
                src/infrastructure/adapters/glob//search.adapter.ts["glob-search.adapter.ts"]
            end
            subgraph src/infrastructure/services["/services"]
                src/infrastructure/services/file//batch//processor.ts["file-batch-processor.ts"]
                src/infrastructure/services/interactive//prompts.ts["interactive-prompts.ts"]
            end
        end
        subgraph src/application/use//cases["/application/use-cases"]
            src/application/use//cases/convert//files.ts["convert-files.ts"]
            src/application/use//cases/init//config.ts["init-config.ts"]
            src/application/use//cases/show//config.ts["show-config.ts"]
            src/application/use//cases/validate//config.ts["validate-config.ts"]
        end
        subgraph src/presentation["/presentation"]
            src/presentation/cli.ts["cli.ts"]
        end
        subgraph src/types["/types"]
            src/types/config.ts["config.ts"]
        end
    end
    subgraph node//modules["node_modules"]
        node//modules/valibot/dist/index.d.cts["valibot"]
        node//modules/cosmiconfig/dist/index.d.ts["cosmiconfig"]
        node//modules/cosmiconfig//typescript//loader/dist/types/index.d.ts["cosmiconfig-typescript-loader"]
        node//modules/globby/index.d.ts["globby"]
        node//modules/yaml/dist/index.d.ts["yaml"]
        node//modules///clack/prompts/dist/index.d.ts["@clack/prompts"]
        node//modules/commander/typings/index.d.ts["commander"]
    end
    src/domain/models/options.ts-->node//modules/valibot/dist/index.d.cts
    src/domain/services/cli//options//parser.ts-->node//modules/valibot/dist/index.d.cts
    src/domain/services/cli//options//parser.ts-->src/domain/models/errors.ts
    src/domain/services/cli//options//parser.ts-->src/domain/models/options.ts
    src/domain/services/options//merger.ts-->src/domain/models/options.ts
    src/domain/constants/package//info.ts-->package.json
    src/infrastructure/adapters/cosmiconfig.adapter.ts-->node//modules/cosmiconfig/dist/index.d.ts
    src/infrastructure/adapters/cosmiconfig.adapter.ts-->node//modules/cosmiconfig//typescript//loader/dist/types/index.d.ts
    src/infrastructure/adapters/cosmiconfig.adapter.ts-->src/domain/constants/package//info.ts
    src/infrastructure/adapters/cosmiconfig.adapter.ts-->src/domain/models/options.ts
    src/domain/services/command//info//generator.ts-->src/domain/constants/package//info.ts
    src/domain/services/command//info//generator.ts-->src/domain/models/options.ts
    src/domain/services/mermaid//formatter.ts-->src/domain/models/options.ts
    src/domain/services/path//calculator.ts-->src/domain/models/options.ts
    src/infrastructure/adapters/glob//search.adapter.ts-->node//modules/globby/index.d.ts
    src/infrastructure/services/file//batch//processor.ts-->src/domain/models/errors.ts
    src/infrastructure/services/file//batch//processor.ts-->src/domain/models/options.ts
    src/infrastructure/services/file//batch//processor.ts-->src/domain/models/result.ts
    src/infrastructure/services/file//batch//processor.ts-->src/domain/services/command//info//generator.ts
    src/infrastructure/services/file//batch//processor.ts-->src/domain/services/mermaid//formatter.ts
    src/infrastructure/services/file//batch//processor.ts-->src/domain/services/path//calculator.ts
    src/infrastructure/services/file//batch//processor.ts-->src/infrastructure/adapters/file//system.adapter.ts
    src/infrastructure/services/file//batch//processor.ts-->src/infrastructure/adapters/glob//search.adapter.ts
    src/application/use//cases/convert//files.ts-->src/domain/models/options.ts
    src/application/use//cases/convert//files.ts-->src/domain/models/result.ts
    src/application/use//cases/convert//files.ts-->src/domain/services/cli//options//parser.ts
    src/application/use//cases/convert//files.ts-->src/domain/services/options//merger.ts
    src/application/use//cases/convert//files.ts-->src/infrastructure/adapters/cosmiconfig.adapter.ts
    src/application/use//cases/convert//files.ts-->src/infrastructure/services/file//batch//processor.ts
    src/domain/services/config//file//generator.ts-->node//modules/yaml/dist/index.d.ts
    src/domain/services/config//file//generator.ts-->src/domain/constants/package//info.ts
    src/domain/services/config//file//generator.ts-->src/domain/models/options.ts
    src/infrastructure/services/interactive//prompts.ts-->node//modules///clack/prompts/dist/index.d.ts
    src/infrastructure/services/interactive//prompts.ts-->src/domain/constants/package//info.ts
    src/infrastructure/services/interactive//prompts.ts-->src/domain/models/errors.ts
    src/infrastructure/services/interactive//prompts.ts-->src/domain/models/options.ts
    src/infrastructure/services/interactive//prompts.ts-->src/domain/services/config//file//generator.ts
    src/application/use//cases/init//config.ts-->src/domain/constants/package//info.ts
    src/application/use//cases/init//config.ts-->src/domain/services/config//file//generator.ts
    src/application/use//cases/init//config.ts-->src/infrastructure/adapters/file//system.adapter.ts
    src/application/use//cases/init//config.ts-->src/infrastructure/services/interactive//prompts.ts
    src/application/use//cases/show//config.ts-->src/domain/models/options.ts
    src/application/use//cases/show//config.ts-->src/infrastructure/adapters/cosmiconfig.adapter.ts
    src/application/use//cases/validate//config.ts-->node//modules/valibot/dist/index.d.cts
    src/application/use//cases/validate//config.ts-->src/domain/models/options.ts
    src/application/use//cases/validate//config.ts-->src/infrastructure/adapters/cosmiconfig.adapter.ts
    src/presentation/cli.ts-->node//modules/commander/typings/index.d.ts
    src/presentation/cli.ts-->src/application/use//cases/convert//files.ts
    src/presentation/cli.ts-->src/application/use//cases/init//config.ts
    src/presentation/cli.ts-->src/application/use//cases/show//config.ts
    src/presentation/cli.ts-->src/application/use//cases/validate//config.ts
    src/presentation/cli.ts-->src/domain/constants/package//info.ts
    src/presentation/cli.ts-->src/domain/models/errors.ts
    src/index.ts-->src/presentation/cli.ts
    src/types/config.ts-->src/domain/models/options.ts
```

