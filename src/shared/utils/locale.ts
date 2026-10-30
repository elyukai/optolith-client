import { isNotEmpty, type NonEmptyArray } from "@elyukai/utils/array/nonEmpty"
import { isNotNullish } from "@elyukai/utils/nullable"
import type { Compare } from "@elyukai/utils/ordering"
import { assertExhaustive } from "@elyukai/utils/typeSafety"
import type { Locale } from "@optolith/database-schema/gen"
import type { LocaleEnvironment as EDLocaleEnvironment } from "@optolith/entity-descriptions"
import { MessageFormat } from "messageformat"
import type { MessageValue } from "messageformat/functions"
import { computed, observable } from "mobx"
import type { TypedEventEmitter } from "./events.ts"

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

/**
 * The set of translation keys that do not have parameters.
 */
export type TranslationKeysWithoutParams = {
  [K in keyof Translations]-?: Translations[K] extends string & {
    __params: object
  }
    ? never
    : K
}[keyof Translations]

/**
 * A dictionary of locale identifiers to other values.
 */
export type LocaleMap<T> = Record<string, T>

/**
 * Selects a value from a locale dictionary based on the selected locale.
 */
export type TranslateMap = <T>(map: LocaleMap<T> | undefined) => T | undefined

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
  locales: string[],
  localeMatcher: Intl.ListFormatLocaleMatcher = "best fit",
  type: Intl.ListFormatType = "conjunction",
  style: Intl.ListFormatStyle = "long",
): Intl.ListFormat => {
  const localeCombination = `${localeMatcher}/${locales.join(",")}`

  if (!(localeCombination in listFormattersCache)) {
    listFormattersCache[localeCombination] = {}
  }

  if (!(type in listFormattersCache[localeCombination]!)) {
    listFormattersCache[localeCombination]![type] = {}
  }

  if (!(style in listFormattersCache[localeCombination]![type]!)) {
    listFormattersCache[localeCombination]![type]![style] = new Intl.ListFormat(locales, {
      localeMatcher,
      type,
      style,
    })
  }

  return listFormattersCache[localeCombination]![type]![style]!
}

export class LocaleEnvironment {
  readonly locales: Record<string, Locale>
  @observable accessor settings: { locale: string | undefined; fallbackLocale: string | undefined }
  readonly systemLocale: string

  constructor(
    locales: Record<string, Locale>,
    systemLocale: string,
    settings: { locale: string | undefined; fallbackLocale: string | undefined },
  ) {
    this.locales = locales
    this.systemLocale = systemLocale
    this.settings = settings
  }

  @computed
  get safeLocales(): NonEmptyArray<string> {
    const locales = [this.settings.locale, this.settings.fallbackLocale].filter(isNotNullish)
    return isNotEmpty(locales)
      ? locales
      : [matchSystemLocaleToSupported(Object.keys(this.locales), this.systemLocale)]
  }

  @computed
  get id(): string {
    return this.safeLocales[0]
  }

  @computed
  get format(): (text: string, args?: Record<string, unknown>) => string {
    const setLocales = this.safeLocales
    return (text, args) =>
      new MessageFormat(setLocales, text, { bidiIsolation: "none" }).format(args)
  }

  @computed
  get compare(): Compare<string> {
    const collator = new Intl.Collator(this.safeLocales, { usage: "sort", numeric: true })
    return collator.compare.bind(collator)
  }

  @computed
  get formatNumber(): (value: number) => string {
    const numberFormatter = new Intl.NumberFormat(this.safeLocales)
    return number =>
      numberFormatter
        .formatToParts(number)
        .map(part => (part.type === "minusSign" ? "−" : part.value))
        .join("")
  }

  @computed
  get formatDate(): (date: Date) => string {
    const dateFormatter = new Intl.DateTimeFormat(this.safeLocales)
    return date => dateFormatter.format(new Date(date))
  }

  @computed
  get translate(): Translate {
    const { locales, safeLocales: setLocales } = this

    const getTranslation = (key: keyof Translations): string => {
      for (const localeId of setLocales) {
        const translation = locales[localeId]?.translations?.[key]
        if (translation !== undefined) {
          return translation
        }
      }
      return key
    }

    return (key, ...rest) =>
      new MessageFormat(setLocales, getTranslation(key as keyof Translations), {
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
              const listFormatter = getListFormatter(
                ctx.locales,
                ctx.localeMatcher,
                listType,
                listStyle,
              )

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
      })
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
  }

  @computed
  get translateMap(): TranslateMap {
    const setLocales = this.safeLocales
    return translations => {
      for (const localeId of setLocales) {
        const translation = translations?.[localeId]
        if (translation !== undefined) {
          return translation
        }
      }
      return undefined
    }
  }

  @computed
  get measurementAdjustments() {
    return {
      milesMultiplier: 1,
      stepsMultiplier: 1,
      halffingersMultiplier: 1,
      stonesMultiplier: 1,
      ...this.locales[this.safeLocales[0]]?.measurementAdjustments,
    }
  }

  @computed
  get join(): (list: string[], type: "conjunction" | "disjunction" | "unit") => string {
    const setLocales = this.safeLocales
    return (list, style) => getListFormatter(setLocales, undefined, style).format(list)
  }

  toObject(): EDLocaleEnvironment {
    return {
      id: this.id,
      format: this.format,
      formatDate: this.formatDate,
      formatNumber: this.formatNumber,
      translate: this.translate,
      translateMap: this.translateMap,
      compare: this.compare,
      join: this.join,
      measurementAdjustments: this.measurementAdjustments,
    }
  }

  listenToLocaleChanges(
    selectedLocaleEvents: TypedEventEmitter<{
      "locale-changed": [locale: string | undefined]
      "fallback-locale-changed": [locale: string | undefined]
    }>,
  ) {
    selectedLocaleEvents.on("locale-changed", locale => {
      this.settings.locale = locale
    })
    selectedLocaleEvents.on("fallback-locale-changed", fallbackLocale => {
      this.settings.fallbackLocale = fallbackLocale
    })
  }
}
