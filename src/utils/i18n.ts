import { LocaleStore } from '../stores/LocaleStore';
import { UILocale } from '../types/data.d';

export function translate<T extends keyof UILocale>(key: T, ...params: (string | number)[]): UILocale[T] {
	const messages = LocaleStore.getMessages();
	const message = messages[key];
	if (params.length > 0 && typeof message === 'string') {
		return message.replace(/\{(\d+)\}/g, (_, p1) => {
			const param = params[Number.parseInt(p1)];
			return typeof param === 'number' ? param.toString() : param;
		});
	}
	return message;
}

export function getLocale() {
	return LocaleStore.getLocale();
}

export function localizeNumber(number: number) {
	const locale = LocaleStore.getLocale() || LocaleStore.getSystemLocale();
	return number.toLocaleString(locale);
}

export function dotToComma(number: number) {
	return number.toString().replace(/\./, ',');
}

/**
 * If the selected language is English centimeters it will be converted to inches.
 */
export function localizeSize(number?: number): number {
	const locale = LocaleStore.getLocale();
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
	const locale = LocaleStore.getLocale();
	if (typeof number !== 'number') {
		return 0;
	}
	else if (locale === 'de-DE') {
		return number;
	}
	return number * 2;
	// return number * 2.2046;
}

export function commaToDot(string: string, int?: boolean) {
	if (int === true) {
		return Number.parseInt(string.replace(/\,/, '.'));
	}
	return Number.parseFloat(string.replace(/\,/, '.'));
}
