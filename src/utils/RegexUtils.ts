export const naturalNumberCheck = /^0|[1-9]\d*$/;

/**
 * Checks if the provided string is a string representation of a natural number.
 * @param string The string to test.
 */
export function isNaturalNumber(string: string): boolean {
	return naturalNumberCheck.test(string);
}

export const integerCheck = /^0|(?:-?[1-9]\d*)$/;

/**
 * Checks if the provided string is a string representation of an integer (whole number).
 * @param string The string to test.
 */
export function isInteger(string: string): boolean {
	return integerCheck.test(string);
}

export const floatCheck = /^0|(?:-?[1-9]\d*(?:[\.,]\d+)?)$/;

/**
 * Checks if the provided string is a string representation of a floating number.
 * @param string The string to test.
 */
export function isFloat(string: string): boolean {
	return floatCheck.test(string);
}

/**
 * Checks if the provided string either is an empty string or passes the given test function.
 * @param string The string to test.
 */
export function isEmptyOr(check: (string: string) => boolean, string: string): boolean {
	return string === '' || check(string);
}

export const base64ImageCheck = /^data:image\/(png|gif|jpeg|jpg);base64,.+/;

/**
 * Checks if the provided string is a base64 encoded image.
 * @param string The string to test.
 */
export function isBase64Image(string: string): boolean {
	return base64ImageCheck.test(string);
}
