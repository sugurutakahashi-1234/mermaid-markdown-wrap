# TypeScript Graph

```bash
tsg --tsconfig tsconfig.build.json --LR --md docs/reports/dependencies/deps-graph.md
```

```mermaid
flowchart LR
    subgraph src["src"]
        subgraph src/domain["/domain"]
            src/domain/errors.ts["errors.ts"]
            src/domain/types.ts["types.ts"]
        end
        subgraph src/application["/application"]
            src/application/converter.ts["converter.ts"]
            src/application/processor.ts["processor.ts"]
        end
        subgraph src/infrastructure["/infrastructure"]
            src/infrastructure/config.ts["config.ts"]
            src/infrastructure/file.ts["file.ts"]
            src/infrastructure/glob.ts["glob.ts"]
            src/infrastructure/version.ts["version.ts"]
        end
        subgraph src/presentation["/presentation"]
            src/presentation/formatter.ts["formatter.ts"]
            src/presentation/commands.ts["commands.ts"]
            src/presentation/config.ts["config.ts"]
            src/presentation/index.ts["index.ts"]
        end
    end
    subgraph node//modules["node_modules"]
        node//modules/valibot/dist/index.d.cts["valibot"]
        node//modules/cosmiconfig/dist/index.d.ts["cosmiconfig"]
        node//modules/cosmiconfig//typescript//loader/dist/types/index.d.ts["cosmiconfig-typescript-loader"]
        node//modules/globby/index.d.ts["globby"]
        node//modules/commander/typings/index.d.ts["commander"]
    end
    src/domain/types.ts-->node//modules/valibot/dist/index.d.cts
    src/domain/types.ts-->src/domain/errors.ts
    src/application/converter.ts-->src/domain/types.ts
    src/infrastructure/config.ts-->node//modules/cosmiconfig/dist/index.d.ts
    src/infrastructure/config.ts-->node//modules/cosmiconfig//typescript//loader/dist/types/index.d.ts
    src/infrastructure/config.ts-->src/domain/types.ts
    src/infrastructure/file.ts-->src/application/converter.ts
    src/infrastructure/file.ts-->src/domain/types.ts
    src/infrastructure/glob.ts-->node//modules/globby/index.d.ts
    src/infrastructure/version.ts-->package.json
    src/presentation/formatter.ts-->src/application/processor.ts
    src/presentation/commands.ts-->src/application/processor.ts
    src/presentation/commands.ts-->src/domain/errors.ts
    src/presentation/commands.ts-->src/domain/types.ts
    src/presentation/commands.ts-->src/infrastructure/config.ts
    src/presentation/commands.ts-->src/infrastructure/file.ts
    src/presentation/commands.ts-->src/infrastructure/glob.ts
    src/presentation/commands.ts-->src/presentation/formatter.ts
    src/presentation/config.ts-->src/domain/types.ts
    src/presentation/index.ts-->node//modules/commander/typings/index.d.ts
    src/presentation/index.ts-->src/domain/types.ts
    src/presentation/index.ts-->src/infrastructure/version.ts
    src/presentation/index.ts-->src/presentation/commands.ts
```

