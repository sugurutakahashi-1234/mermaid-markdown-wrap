import type { KnipConfig } from "knip";

const config: KnipConfig = {
  entry: [],
  project: ["src/**/*.ts"],
  ignoreDependencies: ["tslib", "@commitlint/cli"], // tslib is a runtime dependency, @commitlint/cli is used in CI only
  ignoreBinaries: ["du", "awk", "sed", "act"], // du,awk,sed: deps:size script, act: test:act script
  ignoreExportsUsedInFile: false,
  includeEntryExports: true,
  typescript: {
    config: ["tsconfig.json"],
  },
  // Include @public tagged exports for external users
  tags: ["+public"],
};

export default config;
