export function dotToComma(number: number) {
	return number.toString().replace(/\./, ',');
}

export function commaToDot(string: string, int?: boolean) {
	if (int === true) {
		return Number.parseInt(string.replace(/\,/, '.'));
	}
	return Number.parseFloat(string.replace(/\,/, '.'));
}
