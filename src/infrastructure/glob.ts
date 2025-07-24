import { globby } from "globby";

/**
 * Find files matching the glob pattern
 */
export async function findFiles(globPattern: string): Promise<string[]> {
  return await globby(globPattern);
}
