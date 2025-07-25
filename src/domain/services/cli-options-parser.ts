/**
 * Validation service for domain models
 *
 * This service provides validation logic for various domain objects.
 * Validation is a domain concern as it enforces business rules.
 */

import * as v from "valibot";
import { InvalidOptionsError } from "../models/errors.js";
import type { CLIOptions } from "../models/options.js";
import { CLIOptionsSchema } from "../models/options.js";

/**
 * Parse and validate CLI options
 *
 * Validates raw input against the CLIOptions schema.
 * This is a domain service because it enforces business rules
 * about what constitutes valid options.
 */
export function parseCLIOptions(options: unknown): CLIOptions {
  const result = v.safeParse(CLIOptionsSchema, options);
  if (!result.success) {
    throw new InvalidOptionsError(
      result.issues[0]?.message || "Unknown validation error",
    );
  }
  return result.output;
}
