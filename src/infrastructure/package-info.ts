import packageJson from "../../package.json" with { type: "json" };

/**
 * Get the version of the package
 */
export function getVersion(): string {
  return packageJson.version;
}

/**
 * Get the package name
 */
export function getPackageName(): string {
  return packageJson.name;
}
