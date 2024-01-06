/**
 * Returns a function that always returns the given value.
 * @param value The value to return from the new function.
 * @returns A new function that always returns the given value.
 */
export const constant =
  <T>(value: T) =>
  () =>
    value
