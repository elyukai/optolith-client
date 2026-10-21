import type { NonEmptyArray } from "@elyukai/utils/array/nonEmpty"
import { assertExhaustive } from "@elyukai/utils/typeSafety"
import type { Locale } from "@optolith/database-schema/gen"
import type { LocaleEnvironment } from "@optolith/entity-descriptions"
import { MessageFormat } from "messageformat"
import type { MessageValue } from "messageformat/functions"

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

export const getLocaleEnvironment = (
  locales: Record<string, Locale>,
  setLocales: NonEmptyArray<string>,
): LocaleEnvironment => {
  const locale = locales[setLocales[0]]
  const collator = new Intl.Collator(setLocales, { usage: "sort", numeric: true })
  const dateFormatter = new Intl.DateTimeFormat(setLocales)
  const numberFormatter = new Intl.NumberFormat(setLocales)

  return {
    id: setLocales[0],
    format: (text, args) =>
      new MessageFormat(setLocales, text, { bidiIsolation: "none" }).format(args),
    compare: collator.compare.bind(collator),
    formatNumber: number =>
      numberFormatter
        .formatToParts(number)
        .map(part => (part.type === "minusSign" ? "−" : part.value))
        .join(""),
    formatDate: date => dateFormatter.format(new Date(date)),
    translate: (key, ...rest) =>
      new MessageFormat(
        setLocales,
        locale?.translations?.[key as keyof typeof locale.translations] ?? key,
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
        .join(""),
    translateMap: translations => {
      for (const localeId of setLocales) {
        const translation = translations?.[localeId]
        if (translation !== undefined) {
          return translation
        }
      }
      return undefined
    },
    measurementAdjustments: {
      milesMultiplier: 1,
      stepsMultiplier: 1,
      halffingersMultiplier: 1,
      stonesMultiplier: 1,
      ...locale?.measurementAdjustments,
    },
    join: (list, style) => getListFormatter(setLocales, undefined, style).format(list),
  }
}
