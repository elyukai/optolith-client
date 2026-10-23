import type { NonEmptyArray } from "@elyukai/utils/array/nonEmpty"
import type { Compare } from "@elyukai/utils/ordering"
import { assertExhaustive } from "@elyukai/utils/typeSafety"
import type { Locale } from "@optolith/database-schema/gen"
import type { LocaleEnvironment as EDLocaleEnvironment } from "@optolith/entity-descriptions"
import { MessageFormat } from "messageformat"
import type { MessageValue } from "messageformat/functions"
import { computed } from "mobx"
import type { Translate, TranslateMap, Translations } from "./translate.ts"

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
  #locales: Record<string, Locale>
  #settings: { locales: NonEmptyArray<string> }

  constructor(locales: Record<string, Locale>, settings: { locales: NonEmptyArray<string> }) {
    this.#locales = locales
    this.#settings = settings
  }

  @computed
  get id(): string {
    return this.#settings.locales[0]
  }

  @computed
  get format(): (text: string, args?: Record<string, unknown>) => string {
    const setLocales = this.#settings.locales
    return (text, args) =>
      new MessageFormat(setLocales, text, { bidiIsolation: "none" }).format(args)
  }

  @computed
  get compare(): Compare<string> {
    const collator = new Intl.Collator(this.#settings.locales, { usage: "sort", numeric: true })
    return collator.compare.bind(collator)
  }

  @computed
  get formatNumber(): (value: number) => string {
    const numberFormatter = new Intl.NumberFormat(this.#settings.locales)
    return number =>
      numberFormatter
        .formatToParts(number)
        .map(part => (part.type === "minusSign" ? "−" : part.value))
        .join("")
  }

  @computed
  get formatDate(): (date: Date) => string {
    const dateFormatter = new Intl.DateTimeFormat(this.#settings.locales)
    return date => dateFormatter.format(new Date(date))
  }

  @computed
  get translate(): Translate {
    const setLocales = this.#settings.locales

    const getTranslation = (key: keyof Translations): string => {
      for (const localeId of setLocales) {
        const translation = this.#locales[localeId]?.translations?.[key]
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
    const setLocales = this.#settings.locales
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
      ...this.#locales[this.#settings.locales[0]]?.measurementAdjustments,
    }
  }

  @computed
  get join(): (list: string[], type: "conjunction" | "disjunction" | "unit") => string {
    const setLocales = this.#settings.locales
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
}
