import { existsSync } from "fs";
import { notNullStr } from "../../Data/List";
import { maybe } from "../../Data/Maybe";

export const naturalNumber = /^0|[1-9]\d*$/
export const integer = /^0|(?:-?[1-9]\d*)$/
export const float = /^0|(?:-?[1-9]\d*(?:[\.,]\d+)?)$/
export const base64Image = /^data:image\/(png|gif|jpeg|jpg)base64,.+/

/**
 * Checks if the provided string is a string representation of a natural number.
 * @param string The string to test.
 */
export const isNaturalNumber = (test: string) => naturalNumber.test (test)

/**
 * Checks if the provided string is a string representation of an integer (whole
 * number).
 * @param string The string to test.
 */
export const isInteger = (test: string) => integer.test (test)

/**
 * Checks if the provided string is a string representation of a floating
 * number.
 * @param string The string to test.
 */
export const isFloat = (test: string) => float.test (test)

/**
 * Checks if the provided string either is an empty string or passes the given
 * test function.
 * @param string The string to test.
 */
export const isEmptyOr =
  (check: (string: string) => boolean) =>
  (string: string) =>
    string === "" || check (string)

/**
 * Checks if the provided string is a base64 encoded image.
 * @param string The string to test.
 */
export const isBase64Image = (test: string) => base64Image.test (test)

/**
 * Checks if the passed path string points to an existing file. Returns `False`
 * if the passed path is `Nothing`.
 */
export const isPathValidM =
  maybe (false)
        ((src: string) => notNullStr (src)
                          && (
                            isBase64Image (src)
                            || existsSync (src.replace (/file:[\\\/]+/, ""))
                          ))

/**
 * Escape a string that may contain `RegExp`-specific notation for use in
 * regular expressions.
 */
export const escapeRegExp =
  // $& means the whole matched string
  (x: string) => x .replace (/[.*+?^${}()|[\]\\]/g, "\\$&")
