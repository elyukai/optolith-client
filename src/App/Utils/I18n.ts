import { pipe } from "ramda";
import { thrush } from "../../Data/Function";
import { fnull, List, subscript } from "../../Data/List";
import { fmap, maybe, Maybe, normalize, sum } from "../../Data/Maybe";
import { toOrdering } from "../../Data/Ord";
import { L10n, L10nRecord } from "../Models/Wiki/L10n";

/**
 * Displays a localized message and inserts values into placeholders if
 * necessary.
 * @param messages The object containing all translations.
 * @param key The key in messages containing the string you want to display.
 * @param params If you need to insert values into the string (for example `{0}`
 * inside the string), it will map the params to the placeholders based on
 * index.
 */
export const translateP =
  <T extends typeof L10n.A[keyof typeof L10n.A]>
  (messages: L10nRecord) =>
  (getter: T) =>
  (params: List<string | number>): ReturnType<T> => {
    const message = (getter as unknown as (messages: L10nRecord) => ReturnType<T>) (messages)

    if (!fnull (params) && typeof message === "string") {
      return message.replace (
        /\{(\d+)\}/g,
        (_, p1) => {
          return maybe (`{${p1}}`)
                       ((param: number | string) => typeof param === "number"
                         ? param.toString ()
                         : param)
                       (subscript (params) (Number.parseInt (p1, 10)))
        }
      ) as ReturnType<T>
    }

    return message
  }

/**
 * Displays a localized message.
 * @param messages The object containing all translations.
 * @param key The key in messages containing the string you want to display.
 */
export const translate =
  (messages: L10nRecord) =>
  <T extends typeof L10n.A[keyof typeof L10n.A]>
  (getter: T): ReturnType<T> =>
    translateP (messages) (getter) (List.empty) as ReturnType<T>

/**
 * Displays a localized message and inserts values if necessary.
 * @param messages The object containing all translations.
 * @param key The key in messages containing the string you want to display.
 * @param params If you need to insert values into the string (for example `{0}`
 * inside the string), it will map the params to the placeholders based on
 * index.
 */
export const translateMP =
  <A extends typeof L10n.A[keyof typeof L10n.A]>
  (messages: Maybe<L10nRecord>) =>
  (getter: A) =>
  (params: List<string | number>): Maybe<ReturnType<A>> =>
    fmap<L10nRecord, string | List<string>>
      (pipe (translateP, thrush (getter), (thrush (params))))
      (messages) as Maybe<ReturnType<A>>

/**
 * Displays a localized message.
 * @param messages The object containing all translations.
 * @param key The key in messages containing the string you want to display.
 */
export const translateM =
  <A extends typeof L10n.A[keyof typeof L10n.A]>
  (messages: Maybe<L10nRecord>) =>
  (getter: A): Maybe<ReturnType<A>> =>
    translateMP (messages) (getter) (List.empty) as Maybe<ReturnType<A>>

export const localizeNumber = (localeId: string) => (num: number) => num .toLocaleString (localeId);

/**
 * If the selected language is English centimeters it will be converted to
 * inches.
 *
 * Uses `1cm = 0.4in` instead of `1cm = 0.3937in`.
 */
export const localizeSize =
  (localeId: string) =>
    pipe (fmap<number, number> (size => localeId === "en-US" ? size * 0.4 : size), sum)

/**
 * If the selected language is English kilograms will be converted to pounds.
 *
 * Uses `1kg = 2pd` instead of `1kg = 2.2046pd`.
 */
export const localizeWeight =
  (localeId: string): ((x: number | Maybe<number>) => number) =>
    pipe (normalize, fmap (weight => localeId === "en-US" ? weight * 2 : weight), sum)

/**
 * Takes a locale and returns a locale-aware string compare function.
 */
export const compareLocale =
  (locale: string) => (a: string) => (b: string) =>
    toOrdering (Intl.Collator (locale, { numeric: true }) .compare (a, b))