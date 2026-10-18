import { assertExhaustive } from "@elyukai/utils/typeSafety"
import type { Locale } from "@optolith/database-schema/gen"
import { MessageFormat } from "messageformat"
import type { MessageFunctionContext, MessageValue } from "messageformat/functions"

const matchSystemLocaleToSupported = (available: string[], system: string) => {
  const systemLocale = system.slice(0, 2)
  const matchingLocale = available.find(locale => locale.slice(0, 2) === systemLocale)
  return matchingLocale ?? "en-US"
}

/**
 * The type of all translations
 */
export type Translations = NonNullable<Locale["translations"]>

/**
 * Translates a given key into a string, optionally with parameters.
 */
export type Translate = <K extends keyof Translations>(
  key: K,
  ...rest: TranslationParamsInArray<K>
) => string

/**
 * Extracts the parameters for a given translation key, or never if the key does not have parameters.
 */
export type TranslationParams<K extends keyof Translations> = Translations[K] extends string & {
  __params: infer Params
}
  ? Params
  : undefined

/**
 * Extracts the parameters for a given translation key as an array, or an empty array if the key does not have parameters.
 */
export type TranslationParamsInArray<K extends keyof Translations> =
  Translations[K] extends string & {
    __params: infer Params
  }
    ? [params: Params]
    : []

const listFormattersCache: Partial<
  Record<
    string,
    Partial<Record<Intl.ListFormatType, Partial<Record<Intl.ListFormatStyle, Intl.ListFormat>>>>
  >
> = {}

const isValidListFormatType = (type: unknown): type is Intl.ListFormatType | undefined =>
  type === undefined ||
  (typeof type === "string" && ["conjunction", "disjunction", "unit"].includes(type))

const isValidListFormatStyle = (style: unknown): style is Intl.ListFormatStyle | undefined =>
  style === undefined || (typeof style === "string" && ["long", "short", "narrow"].includes(style))

const getListFormatter = (
  ctx: MessageFunctionContext,
  type: Intl.ListFormatType = "conjunction",
  style: Intl.ListFormatStyle = "long",
): Intl.ListFormat => {
  const localeCombination = `${ctx.localeMatcher}/${ctx.locales.join(",")}`

  if (!(localeCombination in listFormattersCache)) {
    listFormattersCache[localeCombination] = {}
  }

  if (!(type in listFormattersCache[localeCombination]!)) {
    listFormattersCache[localeCombination]![type] = {}
  }

  if (!(style in listFormattersCache[localeCombination]![type]!)) {
    listFormattersCache[localeCombination]![type]![style] = new Intl.ListFormat(ctx.locales, {
      localeMatcher: ctx.localeMatcher,
      type,
      style,
    })
  }

  return listFormattersCache[localeCombination]![type]![style]!
}

/**
 * Creates a translate function based on the given environment, translations and
 * locales.
 */
export const createTranslate = (
  locales: Record<string, Locale>,
  selectedLocale: string | undefined,
  systemLocale: string,
) => {
  const localeId =
    selectedLocale ?? matchSystemLocaleToSupported(Object.keys(locales), systemLocale)

  const translate: Translate = (key, ...rest) =>
    new MessageFormat(
      localeId,
      locales[localeId]?.translations?.[key as keyof Translations] ?? key,
      {
        bidiIsolation: "none",
        functions: {
          list: (ctx, options, input): MessageValue<"list", "listseparator" | "listelement"> => {
            const listType = options["type"]
            const listStyle = options["style"]

            if (!Array.isArray(input)) {
              ctx.onError(new RangeError("Input for list function must be an array"))
              return {
                type: "list",
                options,
              }
            } else if (!isValidListFormatType(listType)) {
              ctx.onError(new RangeError("Unsupported list type: ${options.type}"))
              return {
                type: "list",
                options,
              }
            } else if (!isValidListFormatStyle(listStyle)) {
              ctx.onError(new RangeError("Unsupported list style: ${options.type}"))
              return {
                type: "list",
                options,
              }
            } else {
              const listFormatter = getListFormatter(ctx, listType, listStyle)

              return {
                type: "list",
                options,
                toString() {
                  return listFormatter.format(input)
                },
                toParts() {
                  return listFormatter.formatToParts(input).map(part => ({
                    type: part.type === "literal" ? "listseparator" : "listelement",
                    value: part.value,
                  }))
                },
                valueOf() {
                  return input
                },
              }
            }
          },
        },
      },
    )
      .formatToParts(rest[0] as Record<string, unknown> | undefined)
      .map(part => {
        switch (part.type) {
          case "number":
            return part.parts.map(p => (p.type === "minusSign" ? "−" : p.value)).join("")
          case "string":
          case "bidiIsolation":
          case "text":
            return part.value
          case "listelement":
          case "listseparator":
          case "fallback":
          case "unknown":
            return String(part.value)
          case "markup":
            return ""
          default:
            return assertExhaustive(part)
        }
      })
      .join("")

  return translate
}

/**
 * A mocked translate function.
 */
export const translateMock: Translate = (key, ...rest) =>
  new MessageFormat("en", key).format(rest[0] as Record<string, unknown> | undefined)

/**
 * A dictionary of locale identifiers to other values.
 */
export type LocaleMap<T> = Record<string, T>

/**
 * Selects a value from a locale dictionary based on the selected locale.
 */
export type TranslateMap = <T>(map: LocaleMap<T> | undefined) => T | undefined

/**
 * Creates a function that selects a value from a locale dictionary based on the
 * given environment, translations and locales.
 */
export const createTranslateMap = (
  locales: Record<string, Locale>,
  selectedLocale: string | undefined,
  fallbackLocale: string | undefined,
  systemLocale: string,
) => {
  const mainLocale =
    selectedLocale ?? matchSystemLocaleToSupported(Object.keys(locales), systemLocale)

  const translateMap: TranslateMap = map =>
    map?.[mainLocale] ?? (fallbackLocale === undefined ? undefined : map?.[fallbackLocale])

  return translateMap
}

const byteTags = ["", "K", "M", "G", "T"]

const foldByteLevels = (index: number, value: number): [number, number] =>
  index < byteTags.length - 1 && value > 1023
    ? foldByteLevels(index + 1, value / 1024)
    : [index, value]

/**
 * `bytify :: String -> Int -> String`
 *
 * `bytify id value` returns a string representation of `value`, the amount of
 * bytes, based on the locale specified by `id`. It reduces the value to KB, MB
 * etc so its readable.
 *
 * Examples:
 *
 * ```haskell
 * bytify "de-DE" 1234567 == "1,2 MB"
 * bytify "en-US" 1234567 == "1.2 MB"
 * bytify "en-US" 1024 == "1 KB"
 * bytify "de-DE" 0 == "0 B"
 * ```
 */
export const bytify = (value: number, selectedLocale: string | undefined, systemLocale: string) => {
  const [index, categorizedValue] = foldByteLevels(0, value)
  const rounded = Math.round(categorizedValue * 10) / 10
  const localizedNumber = rounded.toLocaleString(selectedLocale ?? systemLocale)

  return `${localizedNumber} ${byteTags[index] ?? ""}B`
}
