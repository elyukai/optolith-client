const romanNumbers = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

/**
 * Converts a number (max 10) to a Roman number.
 * @param number The number that shall be returned as a Roman number.
 * @param index If the number parameter is the index of the number and not the actual number. Default is false.
 */
export function getRoman(number: number, index?: boolean): string {
	return romanNumbers[number - 1 + (index === true ? 1 : 0)];
}
