import { LocaleStore } from '../stores/LocaleStore';
import { UILocale } from '../types/data.d';

export function translate<T extends keyof UILocale>(key: T): UILocale[T] {
	const messages = LocaleStore.getMessages();
	return messages[key];
}

export function localizeNumber(number: number) {
	const locale = LocaleStore.getLocale();
	return number.toLocaleString(locale);
}

export function dotToComma(number: number) {
	return number.toString().replace(/\./, ',');
}

export function commaToDot(string: string, int?: boolean) {
	if (int === true) {
		return Number.parseInt(string.replace(/\,/, '.'));
	}
	return Number.parseFloat(string.replace(/\,/, '.'));
}
