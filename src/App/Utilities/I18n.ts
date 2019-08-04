import { thrush } from "../../Data/Function";
import { fmap } from "../../Data/Functor";
import { fnull, intercalate, List, subscript, unsnoc } from "../../Data/List";
import { maybe, Maybe, normalize, sum } from "../../Data/Maybe";
import { toOrdering } from "../../Data/Ord";
import { fst, snd } from "../../Data/Tuple";
import { L10n, L10nRecord } from "../Models/Wiki/L10n";
import { pipe } from "./pipe";
import { isString } from "./typeCheckUtils";

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
  (messages: L10nRecord) =>
  <K extends keyof typeof L10n.AL>
  (key: K) =>
  (params: List<string | number>): L10n [K] => {
    const message = L10n.AL [key] (messages)

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
      ) as L10n [K]
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
  <K extends keyof typeof L10n.AL>
  (key: K): L10n [K] =>
    translateP (messages) (key) (List.empty)

/**
 * Displays a localized message and inserts values if necessary.
 * @param messages The object containing all translations.
 * @param key The key in messages containing the string you want to display.
 * @param params If you need to insert values into the string (for example `{0}`
 * inside the string), it will map the params to the placeholders based on
 * index.
 */
export const translateMP =
  (messages: Maybe<L10nRecord>) =>
  <K extends keyof typeof L10n.AL>
  (key: K) =>
  (params: List<string | number>): Maybe<L10n [K]> =>
    fmap<L10nRecord, L10n [K]>
      (pipe (translateP, thrush (key), (thrush (params))))
      (messages)

/**
 * Displays a localized message.
 * @param messages The object containing all translations.
 * @param key The key in messages containing the string you want to display.
 */
export const translateM =
  (messages: Maybe<L10nRecord>) =>
  <K extends keyof typeof L10n.AL>
  (key: K): Maybe<L10n [K]> =>
    translateMP (messages) (key) (List.empty)

export const localizeNumber =
  (localeId: string | L10nRecord) => {
    const locale = isString (localeId) ? localeId : L10n.A.id (localeId)

    return (num: number) => num .toLocaleString (locale)
  }

/**
 * If the selected language is English centimeters it will be converted to
 * inches.
 *
 * Uses `1cm = 0.4in` instead of `1cm = 0.3937in`.
 */
export const localizeSize =
  (localeId: string | L10nRecord): ((x: number | Maybe<number>) => number) =>
    pipe (
      normalize,
      fmap ((size: number) =>
             (isString (localeId) ? localeId : L10n.A.id (localeId)) === "en-US"
               ? size * 0.4
               : size),
      sum
    )

/**
 * If the selected language is English kilograms will be converted to pounds.
 *
 * Uses `1kg = 2pd` instead of `1kg = 2.2046pd`.
 */
export const localizeWeight =
  (localeId: string | L10nRecord): ((x: number | Maybe<number>) => number) =>
    pipe (
      normalize,
      fmap ((weight: number) =>
             (isString (localeId) ? localeId : L10n.A.id (localeId)) === "en-US"
               ? weight * 2
               : weight),
      sum
    )

/**
 * Takes a locale and returns a locale-aware string compare function.
 */
export const compareLocale =
  (locale: string | L10nRecord) => {
    const coll = Intl.Collator (
      isString (locale)
        ? locale
        : L10n.A.id (locale),
      { numeric: true }
    )

    return (a: string) => (b: string) => toOrdering (coll .compare (a, b))
  }

export const localizeList: (sepWord: string) => (xs: List<string | number>) => string =
  sepWord =>
    pipe (
      unsnoc,
      maybe ("")
            (x => fnull (fst (x))
                    ? `${snd (x)}`
                    : `${intercalate (", ") (fst (x))} ${sepWord} ${snd (x)}`)
    )

/**
 * `localizeOrList :: L10n -> [String | Int] -> String`
 *
 * Properly stringify an "or" list. Two items are going to be separated by
 * " or ", if there are more than two items, the first items are separated by
 * ", ".
 *
 * ```haskell
 * localizeOrList l10n [] == ""
 * localizeOrList l10n [13] == "13"
 * localizeOrList l10n [13, 24] == "13 or 24"
 * localizeOrList l10n [13, 14, 24] == "13, 14 or 24"
 * localizeOrList l10n [13, 14, 15, 24] == "13, 14, 15 or 24"
 * ```
 */
export const localizeOrList =
  (l10n: L10nRecord) => localizeList (translate (l10n) ("or"))
