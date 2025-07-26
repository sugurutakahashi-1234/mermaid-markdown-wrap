/**
 * Validation service for domain models
 *
 * This service provides validation logic for various domain objects.
 * Validation is a domain concern as it enforces business rules.
 */

import * as v from "valibot";
import { InvalidOptionsError } from "../models/errors.js";
import type { RawCLIOptions } from "../models/options.js";
import { RawCLIOptionsSchema } from "../models/options.js";

/**
 * Parse and validate raw CLI options
 *
 * Purpose: Parse exactly what the user typed on the command line
 *
 * Why this returns RawCLIOptions:
 * - We need to preserve the original input for the hideCommand feature
 * - Default values will be applied later when creating ProcessingOptions
 * - This separation ensures command display accuracy
 */
export function parseRawCLIOptions(options: unknown): RawCLIOptions {
  const result = v.safeParse(RawCLIOptionsSchema, options);
  if (!result.success) {
    throw new InvalidOptionsError(
      result.issues[0]?.message || "Unknown validation error",
    );
  }
  return result.output;
}
