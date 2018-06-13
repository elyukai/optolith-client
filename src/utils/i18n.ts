import { UIMessages } from '../types/ui.d';
import { Just, Maybe, Nothing, Record } from './dataUtils';

export { UIMessages };

/**
 * Displays a localized message and inserts values if necessary.
 * @param messages The object containing all translations.
 * @param key The key in messages containing the string you want to display.
 * @param params If you need to insert values into the string (for example `{0}`
 * inside the string), it will map the params to the placeholders based on
 * index.
 */
export function translate<T extends keyof UIMessages>(
  messages: Just<Record<UIMessages>>,
  key: T,
  ...params: (string | number)[]
): Just<NonNullable<UIMessages[T]>>;
export function translate<T extends keyof UIMessages>(
  messages: Nothing,
  key: T,
  ...params: (string | number)[]
): Nothing;
export function translate<T extends keyof UIMessages>(
  messages: Maybe<Record<UIMessages>>,
  key: T,
  ...params: (string | number)[]
): Maybe<NonNullable<UIMessages[T]>>;
export function translate<T extends keyof UIMessages>(
  messages: Maybe<Record<UIMessages>>,
  key: T,
  ...params: (string | number)[]
): Maybe<NonNullable<UIMessages[T]>> {
  return messages.bind(messages => messages.lookup(key) as Maybe<NonNullable<UIMessages[T]>>)
    .map(message => {
      if (params.length > 0 && typeof message === 'string') {
        return message.replace(/\{(\d+)\}/g, (_, p1) => {
          const param = params[Number.parseInt(p1)];
          return typeof param === 'number' ? param.toString() : param;
        });
      }

      return message;
    }) as Maybe<NonNullable<UIMessages[T]>>;
}

export const localizeNumber = (n: number, locale: string) => {
  return n.toLocaleString(locale);
};

/**
 * If the selected language is English centimeters it will be converted to
 * inches.
 *
 * Uses `1cm = 0.4in` instead of `1cm = 0.3937in`.
 */
export const localizeSize = (
  number: number | undefined,
  locale: string,
): number => {
  if (typeof number !== 'number') {
    return 0;
  }
  else if (locale === 'en-US') {
    return number * 0.4;
  }

  return number;
};

/**
 * If the selected language is English kilograms will be converted to pounds.
 *
 * Uses `1kg = 2pd` instead of `1kg = 2.2046pd`.
 */
export const localizeWeight = (
  number: number | undefined,
  locale: string,
): number => {
  if (typeof number !== 'number') {
    return 0;
  }
  else if (locale === 'en-US') {
    return number * 2;
  }

  return number;
};
