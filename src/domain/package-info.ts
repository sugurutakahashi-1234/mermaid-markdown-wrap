/**
 * NPM package metadata constants
 *
 * This module provides access to basic package information from package.json.
 * These are treated as application constants/metadata in the domain layer
 * following NPM conventions.
 */
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
