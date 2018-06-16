import { UIMessages } from '../types/ui.d';

/**
 * Displays a localized message and inserts values if necessary.
 * @param messages The object containing all translations.
 * @param key The key in messages containing the string you want to display.
 * @param params If you need to insert values into the string (for example `{0}` inside the string), it will map the params to the placeholders based on index.
 */
export function _translate<T extends keyof UIMessages>(messages: UIMessages, key: T, ...params: (string | number)[]): UIMessages[T];
export function _translate<T extends keyof UIMessages>(messages: undefined, key: T, ...params: (string | number)[]): undefined;
export function _translate<T extends keyof UIMessages>(messages: UIMessages | undefined, key: T, ...params: (string | number)[]): UIMessages[T] | undefined;
export function _translate<T extends keyof UIMessages>(messages: UIMessages | undefined, key: T, ...params: (string | number)[]): UIMessages[T] | undefined {
	if (messages === undefined) {
		return '...';
	}
	const message = messages[key];
	if (params.length > 0 && typeof message === 'string') {
		return message.replace(/\{(\d+)\}/g, (_, p1) => {
			const param = params[Number.parseInt(p1)];
			return typeof param === 'number' ? param.toString() : param;
		});
	}
	return message;
}

export { UIMessages };

export function _localizeNumber(number: number, locale: string) {
	return number.toLocaleString(locale);
}

/**
 * If the selected language is English centimeters it will be converted to inches.
 */
export function _localizeSize(number: number | undefined, locale: string): number {
	if (typeof number !== 'number') {
		return 0;
	}
	else if (['de-DE', 'nl-BE'].includes(locale)) {
		return number;
	}
	return number * 0.4;
	// return number * 0.3937;
}

/**
 * If the selected language is English kilograms will be converted to pounds.
 */
export function _localizeWeight(number: number | undefined, locale: string): number {
	if (typeof number !== 'number') {
		return 0;
	}
	else if (['de-DE', 'nl-BE'].includes(locale)) {
		return number;
	}
	return number * 2;
	// return number * 2.2046;
}
