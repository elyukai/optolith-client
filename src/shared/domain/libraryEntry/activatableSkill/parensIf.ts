/**
 * Wraps a string in parentheses with a leading space if it is not empty or
 * `undefined`.
 */
export const parensIf = (text: string | undefined): string =>
  text === undefined || text === "" ? "" : ` (${text})`

/**
 * Appends a string in parentheses with a leading space if it is not empty or
 * `undefined`.
 */
export const appendInParens = (text: string, append: string | undefined): string =>
  append === undefined || append === "" ? text : `${text} (${append})`
