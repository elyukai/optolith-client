const romanNumbers = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII'];

/**
 * Converts a number to a Roman number.
 * @param number The number that shall be returned as a Roman number.
 * @param index If the number parameter is the index of the number and not the actual number. Default is false.
 */
export function getRoman(number: number, index?: boolean): string {
	return romanNumbers[number + (index === true ? 0 : -1)];
}

/**
 * Forces signing on the given number.
 * @param number
 */
export function sign(number: number): string {
	return number > 0 ? `+${number}` : number.toString();
}

/**
 * Forces signing on the given number, ignores 0.
 * @param number
 */
export function signNull(number: number, placeholder: string = ''): string {
	return number > 0 ? `+${number}` : number < 0 ? number.toString() : placeholder;
}

/**
 * Multiplies given string by 100 if it contains `,` o `.`.
 * @param number
 */
export function multiplyString(string: string): string {
	return /^\d+[,\.]\d+$/.test(string) ? (Number.parseFloat(string.replace(/,/, '.')) * 100).toString() : string;
}
