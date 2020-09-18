import { fmap } from "../../Data/Functor"
import { fnull, intercalate, List, NonEmptyList, notNull, subscript, unsnoc } from "../../Data/List"
import { ensure, maybe, Maybe, normalize, sum } from "../../Data/Maybe"
import { toOrdering } from "../../Data/Ord"
import { first, fst, Pair, snd } from "../../Data/Tuple"
import { L10n } from "../Models/Wiki/L10n"
import { StaticData, StaticDataRecord } from "../Models/Wiki/WikiModel"
import { pipe, pipe_ } from "./pipe"

const SDA = StaticData.A

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
  (messages: StaticDataRecord) =>
  <K extends keyof typeof L10n.A>
  (key: K) =>
  (params: List<string | number>): string => {
    const l10n = StaticData.is (messages) ? SDA.ui (messages) : messages
    const message: string = L10n.A [key] (l10n)

    if (!fnull (params) && typeof message === "string") {
      return message.replace (
        /\{(?<index>\d+)\}/gu,
        (_match, _p1, _offset, _s, { index }) => maybe (`{${index}}`)
                         ((param: number | string) => typeof param === "number"
                           ? param.toString ()
                           : param)
                         (subscript (params) (Number.parseInt (index, 10)))
      )
    }

    return message
  }

/**
 * Displays a localized message.
 * @param messages The object containing all translations.
 * @param key The key in messages containing the string you want to display.
 */
export const translate =
  (messages: StaticDataRecord) =>
  <K extends keyof typeof L10n.A>
  (key: K): string =>
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
  (messages: Maybe<StaticDataRecord>) =>
  <K extends keyof typeof L10n.A>
  (key: K) =>
  (params: List<string | number>): Maybe<L10n [K]> =>
    fmap<StaticDataRecord, L10n [K]>
      (msg => translateP (msg) (key) (params))
      (messages)

/**
 * Displays a localized message.
 * @param messages The object containing all translations.
 * @param key The key in messages containing the string you want to display.
 */
export const translateM =
  (messages: Maybe<StaticDataRecord>) =>
  <K extends keyof typeof L10n.AL>
  (key: K): Maybe<L10n [K]> =>
    translateMP (messages) (key) (List.empty)

export const localizeNumber =
  (staticData: StaticDataRecord) => {
    const locale = L10n.A.id (SDA.ui (staticData))

    return (num: number) => num .toLocaleString (locale)
  }

const floorUnit = (x: number) => Math.floor (x * 1000) / 1000

/**
 * If the selected language is English centimeters it will be converted to
 * inches.
 *
 * Uses `1cm = 0.4in` instead of `1cm = 0.3937in`.
 */
export const localizeSize =
  (staticData: StaticDataRecord): ((x: number | Maybe<number>) => number) =>
    pipe (
      normalize,
      fmap ((size: number) => L10n.A.id (SDA.ui (staticData)) === "en-US"
                              ? size * 0.4
                              : size),
      sum,
      floorUnit
    )

/**
 * If the selected language is English kilograms will be converted to pounds.
 *
 * Uses `1kg = 2pd` instead of `1kg = 2.2046pd`.
 */
export const localizeWeight =
  (staticData: StaticDataRecord): ((x: number | Maybe<number>) => number) =>
    pipe (
      normalize,
      fmap ((weight: number) => L10n.A.id (SDA.ui (staticData)) === "en-US"
                                ? weight * 2
                                : weight),
      sum,
      floorUnit
    )

/**
 * Takes a locale and returns a locale-aware string compare function.
 */
export const compareLocale =
  (staticData: StaticDataRecord) => {
    const coll = Intl.Collator (
      L10n.A.id (SDA.ui (staticData)),
      { numeric: true }
    )

    return (a: string) => (b: string) => toOrdering (coll .compare (a, b))
  }

const getOr = pipe (SDA.ui, L10n.A["general.or"])

const concatMultiple = (staticData: StaticDataRecord) =>
                       (init: NonEmptyList<string | number>) =>
                       (last: string | number) =>
                         `${intercalate (", ") (init)} ${getOr (staticData)} ${last}`

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
export const localizeOrList: (staticData: StaticDataRecord)
                           => (xs: List<string | number>)
                           => string
                           = staticData =>
                           pipe (
                             unsnoc,
                             maybe ("")
                                   (x => {
                                     const init = fst (x)

                                     return fnull (init)
                                       ? `${snd (x)}`
                                       : concatMultiple (staticData) (init) (snd (x))
                                   })
                           )

const getFormattedSep = (type: "conjunction" | "disjunction") =>
                        (static_data: StaticDataRecord): string =>
                          type === "conjunction"
                          ? translate (static_data) ("general.and")
                          : translate (static_data) ("general.or")

const joinWithSep = (type: "conjunction" | "disjunction") =>
                    (static_data: StaticDataRecord) =>
                    (str2: string | number) =>
                    (str1: string): string =>
                      `${str1} ${getFormattedSep (type) (static_data)} ${str2}`

const forceStr = (x: string | number) => typeof x === "number" ? String (x) : x

export const formatList = (type: "conjunction" | "disjunction") =>
                          (static_data: StaticDataRecord) =>
                          (xs: List<string | number>): string =>
                            pipe_ (
                              xs,
                              unsnoc,
                              maybe ("")
                                    (pipe (
                                      first (pipe (ensure (notNull), fmap (intercalate (", ")))),
                                      (p: Pair<Maybe<string>, string | number>) =>
                                        pipe_ (
                                          p,
                                          fst,
                                          maybe (forceStr (snd (p)))
                                                (joinWithSep (type)
                                                             (static_data)
                                                             (forceStr (snd (p))))
                                        )
                                    ))
                            )
