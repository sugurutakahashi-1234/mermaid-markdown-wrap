# TypeScript Graph

```bash
tsg --tsconfig tsconfig.build.json --LR --abstraction src/domain --abstraction src/application --abstraction src/infrastructure --abstraction src/presentation --md docs/reports/dependencies/layers.md
```

```mermaid
flowchart LR
    classDef dir fill:#0000,stroke:#999
    subgraph src["src"]
        src/domain["/domain"]:::dir
        src/application["/application"]:::dir
        src/infrastructure["/infrastructure"]:::dir
        src/presentation["/presentation"]:::dir
    end
    subgraph node//modules["node_modules"]
        node//modules/valibot/dist/index.d.cts["valibot"]
        node//modules/cosmiconfig/dist/index.d.ts["cosmiconfig"]
        node//modules/cosmiconfig//typescript//loader/dist/types/index.d.ts["cosmiconfig-typescript-loader"]
        node//modules/globby/index.d.ts["globby"]
        node//modules/commander/typings/index.d.ts["commander"]
    end
    src/domain-->node//modules/valibot/dist/index.d.cts
    src/application-->src/domain
    src/infrastructure-->node//modules/cosmiconfig/dist/index.d.ts
    src/infrastructure-->node//modules/cosmiconfig//typescript//loader/dist/types/index.d.ts
    src/infrastructure-->src/domain
    src/infrastructure-->src/application
    src/infrastructure-->node//modules/globby/index.d.ts
    src/infrastructure-->package.json
    src/presentation-->src/application
    src/presentation-->src/domain
    src/presentation-->src/infrastructure
    src/presentation-->node//modules/commander/typings/index.d.ts
```

