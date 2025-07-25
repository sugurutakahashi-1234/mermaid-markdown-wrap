/**
 * File storage service
 *
 * This service provides high-level file operations for the application.
 * It combines multiple adapters to provide a cohesive file management interface.
 */

import { basename, dirname, extname, join } from "node:path";
import type { Options } from "../../domain/models/options.js";
import {
  createDirectory,
  deleteFile,
  readTextFile,
  writeTextFile,
} from "../adapters/file-system.adapter.js";
import { findFilesByPattern } from "../adapters/glob-search.adapter.js";

/**
 * File storage service for Mermaid file operations
 */
export class FileStorageService {
  /**
   * Find all Mermaid files matching the pattern
   */
  async findMermaidFiles(pattern: string): Promise<string[]> {
    return await findFilesByPattern(pattern);
  }

  /**
   * Read content from a file
   */
  async readContent(filePath: string): Promise<string> {
    return await readTextFile(filePath);
  }

  /**
   * Write content to a file
   */
  async writeContent(filePath: string, content: string): Promise<void> {
    await writeTextFile(filePath, content);
  }

  /**
   * Delete a file
   */
  async removeFile(filePath: string): Promise<void> {
    await deleteFile(filePath);
  }

  /**
   * Ensure output directory exists
   */
  async ensureOutputDirectory(dirPath: string | undefined): Promise<void> {
    if (dirPath) {
      await createDirectory(dirPath);
    }
  }

  /**
   * Calculate output path for a converted file
   */
  getOutputPath(inputPath: string, options: Options): string {
    const dir = dirname(inputPath);
    const baseName = basename(inputPath, extname(inputPath));
    const outputDir = options.outDir || dir;
    const outputFileName = `${baseName}${options.extension}`;

    return join(outputDir, outputFileName);
  }
}

// Export singleton instance
export const fileStorageService = new FileStorageService();
