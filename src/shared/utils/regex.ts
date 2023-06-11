/**
 * Checks if the provided string is a string representation of a natural number.
 * @param string The string to test.
 */
export const isNaturalNumber = (test: string) => /^(?:0|[1-9][0-9]*)$/u.test(test)

/**
 * Checks if the provided string is a string representation of an integer.
 * @param string The string to test.
 */
export const isInteger = (test: string) => /^(?:0|-?[1-9][0-9]*)$/u.test(test)
