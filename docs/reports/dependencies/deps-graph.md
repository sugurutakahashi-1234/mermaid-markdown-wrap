# TypeScript Graph

```bash
tsg --tsconfig tsconfig.build.json --LR --md docs/reports/dependencies/deps-graph.md
```

```mermaid
flowchart LR
    subgraph src["src"]
        src/index.ts["index.ts"]
        subgraph src/domain["/domain"]
            src/domain/errors.ts["errors.ts"]
            src/domain/cli//options.ts["cli-options.ts"]
        end
        subgraph src/infrastructure["/infrastructure"]
            src/infrastructure/config.ts["config.ts"]
            src/infrastructure/package//info.ts["package-info.ts"]
            src/infrastructure/file//system.ts["file-system.ts"]
        end
        subgraph src/application["/application"]
            src/application/process//result//types.ts["process-result-types.ts"]
            src/application/markdown//builder.ts["markdown-builder.ts"]
            src/application/mermaid//file//processor.ts["mermaid-file-processor.ts"]
            subgraph src/application/use//cases["/use-cases"]
                src/application/use//cases/convert//files.ts["convert-files.ts"]
            end
        end
        subgraph src/presentation["/presentation"]
            src/presentation/console//reporter.ts["console-reporter.ts"]
            src/presentation/cli//adapter.ts["cli-adapter.ts"]
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
        node//modules/commander/typings/index.d.ts["commander"]
    end
    src/domain/cli//options.ts-->node//modules/valibot/dist/index.d.cts
    src/domain/cli//options.ts-->src/domain/errors.ts
    src/infrastructure/config.ts-->node//modules/cosmiconfig/dist/index.d.ts
    src/infrastructure/config.ts-->node//modules/cosmiconfig//typescript//loader/dist/types/index.d.ts
    src/infrastructure/config.ts-->src/domain/cli//options.ts
    src/infrastructure/package//info.ts-->package.json
    src/infrastructure/file//system.ts-->node//modules/globby/index.d.ts
    src/application/markdown//builder.ts-->src/domain/cli//options.ts
    src/application/mermaid//file//processor.ts-->src/domain/cli//options.ts
    src/application/mermaid//file//processor.ts-->src/infrastructure/file//system.ts
    src/application/mermaid//file//processor.ts-->src/application/markdown//builder.ts
    src/application/use//cases/convert//files.ts-->src/domain/cli//options.ts
    src/application/use//cases/convert//files.ts-->src/domain/errors.ts
    src/application/use//cases/convert//files.ts-->src/infrastructure/config.ts
    src/application/use//cases/convert//files.ts-->src/infrastructure/file//system.ts
    src/application/use//cases/convert//files.ts-->src/application/mermaid//file//processor.ts
    src/application/use//cases/convert//files.ts-->src/application/process//result//types.ts
    src/presentation/console//reporter.ts-->src/application/process//result//types.ts
    src/presentation/cli//adapter.ts-->src/application/process//result//types.ts
    src/presentation/cli//adapter.ts-->src/application/use//cases/convert//files.ts
    src/presentation/cli//adapter.ts-->src/domain/cli//options.ts
    src/presentation/cli//adapter.ts-->src/domain/errors.ts
    src/presentation/cli//adapter.ts-->src/presentation/console//reporter.ts
    src/presentation/cli.ts-->node//modules/commander/typings/index.d.ts
    src/presentation/cli.ts-->node//modules/valibot/dist/index.d.cts
    src/presentation/cli.ts-->src/domain/cli//options.ts
    src/presentation/cli.ts-->src/infrastructure/config.ts
    src/presentation/cli.ts-->src/infrastructure/package//info.ts
    src/presentation/cli.ts-->src/presentation/cli//adapter.ts
    src/index.ts-->src/presentation/cli.ts
    src/types/config.ts-->src/domain/cli//options.ts
```

