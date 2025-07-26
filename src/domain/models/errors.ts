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

/**
 * Error thrown when user cancels an operation
 */
export class UserCancelledError extends Error {
  constructor(message = "Operation cancelled by user") {
    super(message);
    this.name = "UserCancelledError";
  }
}
