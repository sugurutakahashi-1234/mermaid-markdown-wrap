/**
 * Error thrown when no files are found matching the pattern
 */
export class NoFilesFoundError extends Error {
  constructor(public pattern: string) {
    super(`No files found matching pattern: ${pattern}`);
    this.name = "NoFilesFoundError";
  }
}

/**
 * Error thrown when CLI options are invalid
 */
export class InvalidOptionsError extends Error {
  constructor(message: string) {
    super(`Invalid options: ${message}`);
    this.name = "InvalidOptionsError";
  }
}
