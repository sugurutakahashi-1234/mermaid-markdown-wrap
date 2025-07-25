/**
 * Batch processor service - handles batch file processing
 *
 * This service manages the technical aspects of processing multiple files
 * in parallel, including error handling and result aggregation.
 */

import { NoFilesFoundError } from "../../domain/models/errors.js";
import type { Options } from "../../domain/models/options.js";
import type { FileConversionResult } from "../../domain/models/result.js";
import { formatMermaidAsMarkdown } from "../../domain/services/mermaid-formatter.js";
import { fileStorageService } from "./file-storage.service.js";

/**
 * Service for batch processing of Mermaid files
 */
export class BatchProcessorService {
  /**
   * Convert a single file
   */
  private async convertSingleFile(
    filePath: string,
    options: Options,
  ): Promise<void> {
    // Read source content
    const content = await fileStorageService.readContent(filePath);

    // Apply business rule: format as markdown
    const formattedContent = formatMermaidAsMarkdown(content, options);

    // Calculate output path
    const outputPath = fileStorageService.getOutputPath(filePath, options);

    // Write formatted content
    await fileStorageService.writeContent(outputPath, formattedContent);

    // Delete source if requested
    if (!options.keepSource) {
      await fileStorageService.removeFile(filePath);
    }
  }

  /**
   * Convert multiple files in parallel
   */
  async convertFiles(
    pattern: string,
    options: Options,
  ): Promise<FileConversionResult[]> {
    // Find files matching pattern
    const files = await fileStorageService.findMermaidFiles(pattern);

    if (files.length === 0) {
      throw new NoFilesFoundError(pattern);
    }

    // Ensure output directory exists
    await fileStorageService.ensureOutputDirectory(options.outDir);

    // Process files in parallel with error handling
    const results = await Promise.allSettled(
      files.map(async (filePath): Promise<FileConversionResult> => {
        try {
          await this.convertSingleFile(filePath, options);
          return { filePath, success: true };
        } catch (error) {
          return {
            filePath,
            success: false,
            error: error instanceof Error ? error : new Error(String(error)),
          };
        }
      }),
    );

    // Transform Promise.allSettled results
    return results.map((result, index) => {
      if (result.status === "fulfilled") {
        return result.value;
      }
      return {
        filePath: files[index] || "unknown",
        success: false,
        error:
          result.reason instanceof Error
            ? result.reason
            : new Error(String(result.reason)),
      };
    });
  }
}

// Export singleton instance
export const batchProcessor = new BatchProcessorService();
