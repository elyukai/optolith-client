export const naturalNumber = /^0|[1-9]\d*$/;
export const integer = /^0|(?:-?[1-9]\d*)$/;
export const float = /^0|(?:-?[1-9]\d*(?:[\.,]\d+)?)$/;
export const base64Image = /^data:image\/(png|gif|jpeg|jpg);base64,.+/;

/**
 * Checks if the provided string is a string representation of a natural number.
 * @param string The string to test.
 */
export const isNaturalNumber = (string: string) => naturalNumber.test(string);

/**
 * Checks if the provided string is a string representation of an integer (whole
 * number).
 * @param string The string to test.
 */
export const isInteger = (string: string) => integer.test(string);

/**
 * Checks if the provided string is a string representation of a floating
 * number.
 * @param string The string to test.
 */
export const isFloat = (string: string) => float.test(string);

/**
 * Checks if the provided string either is an empty string or passes the given
 * test function.
 * @param string The string to test.
 */
export const isEmptyOr = (check: (string: string) => boolean, string: string) =>
  string === '' || check(string);

/**
 * Checks if the provided string is a base64 encoded image.
 * @param string The string to test.
 */
export const isBase64Image = (string: string) => base64Image.test(string);
