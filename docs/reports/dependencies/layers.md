# TypeScript Graph

```bash
tsg --tsconfig tsconfig.build.json --LR --abstraction src/domain --abstraction src/application --abstraction src/infrastructure --abstraction src/presentation --md docs/reports/dependencies/layers.md
```

```mermaid
flowchart LR
    classDef dir fill:#0000,stroke:#999
    subgraph src["src"]
        src/domain["/domain"]:::dir
        src/config.ts["config.ts"]
        src/infrastructure["/infrastructure"]:::dir
        src/application["/application"]:::dir
        src/presentation["/presentation"]:::dir
        src/index.ts["index.ts"]
    end
    subgraph node//modules["node_modules"]
        node//modules/valibot/dist/index.d.cts["valibot"]
        node//modules/globby/index.d.ts["globby"]
        node//modules/yaml/dist/index.d.ts["yaml"]
        node//modules///clack/prompts/dist/index.d.ts["@clack/prompts"]
        node//modules/cosmiconfig/dist/index.d.ts["cosmiconfig"]
        node//modules/cosmiconfig//typescript//loader/dist/types/index.d.ts["cosmiconfig-typescript-loader"]
        node//modules/commander/typings/index.d.ts["commander"]
    end
    src/domain-->node//modules/valibot/dist/index.d.cts
    src/config.ts-->src/domain
    src/domain-->package.json
    src/infrastructure-->node//modules/globby/index.d.ts
    src/infrastructure-->src/domain
    src/application-->src/domain
    src/application-->src/infrastructure
    src/domain-->node//modules/yaml/dist/index.d.ts
    src/infrastructure-->node//modules///clack/prompts/dist/index.d.ts
    src/infrastructure-->node//modules/cosmiconfig/dist/index.d.ts
    src/infrastructure-->node//modules/cosmiconfig//typescript//loader/dist/types/index.d.ts
    src/infrastructure-->node//modules/valibot/dist/index.d.cts
    src/presentation-->node//modules/commander/typings/index.d.ts
    src/presentation-->src/application
    src/presentation-->src/domain
    src/index.ts-->src/presentation
```

