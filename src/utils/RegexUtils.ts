/**
 * Checks if the provided string is a string representation of an integer.
 * @param string The string to test.
 */
export function isInteger(string: string) {
	return /^\d+$/.test(string);
}
