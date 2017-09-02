import * as I18n from '../selectors/I18n';
import { UIMessages } from '../types/ui.d';

export function translate<T extends keyof UIMessages>(key: T, ...params: (string | number)[]): UIMessages[T] {
	const message = I18n.getMessages()[key];
	if (params.length > 0 && typeof message === 'string') {
		return message.replace(/\{(\d+)\}/g, (_, p1) => {
			const param = params[Number.parseInt(p1)];
			return typeof param === 'number' ? param.toString() : param;
		});
	}
	return message;
}

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

export function getLocale() {
	return I18n.getLocale();
}

export function localizeNumber(number: number) {
	const locale = I18n.getLocale();
	return number.toLocaleString(locale);
}

export function _localizeNumber(number: number, locale: string) {
	return number.toLocaleString(locale);
}

export function dotToComma(number: number) {
	return number.toString().replace(/\./, ',');
}

/**
 * If the selected language is English centimeters it will be converted to inches.
 */
export function localizeSize(number?: number): number {
	const locale = I18n.getLocale();
	if (typeof number !== 'number') {
		return 0;
	}
	else if (locale === 'de-DE') {
		return number;
	}
	return number * 0.4;
	// return number * 0.3937;
}

/**
 * If the selected language is English centimeters it will be converted to inches.
 */
export function _localizeSize(number: number | undefined, locale: string): number {
	if (typeof number !== 'number') {
		return 0;
	}
	else if (locale === 'de-DE') {
		return number;
	}
	return number * 0.4;
	// return number * 0.3937;
}

/**
 * If the selected language is English kilograms will be converted to pounds.
 */
export function localizeWeight(number?: number): number {
	const locale = I18n.getLocale();
	if (typeof number !== 'number') {
		return 0;
	}
	else if (locale === 'de-DE') {
		return number;
	}
	return number * 2;
	// return number * 2.2046;
}

/**
 * If the selected language is English kilograms will be converted to pounds.
 */
export function _localizeWeight(number: number | undefined, locale: string): number {
	if (typeof number !== 'number') {
		return 0;
	}
	else if (locale === 'de-DE') {
		return number;
	}
	return number * 2;
	// return number * 2.2046;
}
