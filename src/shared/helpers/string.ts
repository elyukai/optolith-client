/**
 * Checks if a value is a non-empty string.
 */
export const isNonEmptyString = (value: string | null | undefined): value is string =>
  typeof value === "string" && value.length > 0
