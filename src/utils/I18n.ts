import * as R from 'ramda';
import { UIMessages, UIMessagesObject } from '../types/ui';
import { Maybe } from './dataUtils';

export { UIMessages, UIMessagesObject };

/**
 * Displays a localized message and inserts values if necessary.
 * @param messages The object containing all translations.
 * @param key The key in messages containing the string you want to display.
 * @param params If you need to insert values into the string (for example `{0}`
 * inside the string), it will map the params to the placeholders based on
 * index.
 */
export function translate<T extends keyof UIMessages> (
  messages: UIMessagesObject,
  key: T,
  ...params: (string | number)[]
): UIMessages[T];
export function translate<T extends keyof UIMessages> (
  messages: Maybe<UIMessagesObject>,
  key: T,
  ...params: (string | number)[]
): Maybe<UIMessages[T]>;
export function translate<T extends keyof UIMessages> (
  messages: Maybe<UIMessagesObject> | UIMessagesObject,
  key: T,
  ...params: (string | number)[]
): Maybe<UIMessages[T]> | UIMessages[T] {
  if (messages instanceof Maybe) {
    return messages
      .fmap (safeMessages => safeMessages.get (key) as UIMessages[T])
      .fmap (message => {
        if (params.length > 0 && typeof message === 'string') {
          return message.replace (/\{(\d+)\}/g, (_, p1) => {
            const param = params[Number.parseInt (p1)];

            return typeof param === 'number' ? param.toString () : param;
          });
        }

        return message;
      }) as Maybe<UIMessages[T]>;
  }
  else {
    const message = messages.get (key) as UIMessages[T];

    if (params.length > 0 && typeof message === 'string') {
      return message.replace (/\{(\d+)\}/g, (_, p1) => {
        const param = params[Number.parseInt (p1)];

        return typeof param === 'number' ? param.toString () : param;
      });
    }

    return message;
  }
}

export const localizeNumber = (localeId: string) => (num: number) => num .toLocaleString (localeId);

/**
 * If the selected language is English centimeters it will be converted to
 * inches.
 *
 * Uses `1cm = 0.4in` instead of `1cm = 0.3937in`.
 */
export const localizeSize = (localeId: string) => R.pipe (
  Maybe.fmap<number, number> (size => localeId === 'en-US' ? size * 0.4 : size),
  Maybe.fromMaybe (0)
);

/**
 * If the selected language is English kilograms will be converted to pounds.
 *
 * Uses `1kg = 2pd` instead of `1kg = 2.2046pd`.
 */
export const localizeWeight = (localeId: string): ((x: number | Maybe<number>) => number) =>
  R.pipe (
    Maybe.normalize,
    Maybe.fmap (weight => localeId === 'en-US' ? weight * 2 : weight),
    Maybe.fromMaybe (0)
  );
