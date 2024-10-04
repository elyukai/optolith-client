import { LocaleMap } from "optolith-database-schema/types/_LocaleMap"
import {
  ResponsiveText,
  ResponsiveTextOptional,
  ResponsiveTextReplace,
} from "optolith-database-schema/types/_ResponsiveText"
import { mapNullable } from "../../utils/nullable.ts"
import { TranslateMap } from "../../utils/translate.ts"
import { assertExhaustive } from "../../utils/typeSafety.ts"
import { MISSING_VALUE } from "./unknown.ts"

/**
 * Whether the entry is displayed in a normal or compressed setting. Normal/full
 * usually means a full library entry display, whether compressed usually means
 * the character sheet.
 */
export enum ResponsiveTextSize {
  Compressed,
  Full,
}

/**
 * Executes one of two functions depending on the responsive text size.
 */
export const responsive = <T, A extends unknown[]>(
  size: ResponsiveTextSize,
  full: (...args: A) => T,
  compressed: (...args: A) => T,
  ...args: A
): T => {
  switch (size) {
    case ResponsiveTextSize.Compressed:
      return compressed(...args)
    case ResponsiveTextSize.Full:
      return full(...args)
    default:
      return assertExhaustive(size)
  }
}

/**
 * Returns the responsive text for a given size.
 */
export const getResponsiveText = (
  value: ResponsiveText | undefined,
  size: ResponsiveTextSize,
): string => {
  if (value === undefined) {
    return MISSING_VALUE
  }

  return responsive(
    size,
    () => value.full,
    () => value.compressed,
  )
}

/**
 * Returns the responsive text for a given size if it is defined.
 */
export const getResponsiveTextOptional = (
  value: ResponsiveTextOptional | undefined,
  size: ResponsiveTextSize,
): string | undefined => {
  if (value === undefined) {
    return MISSING_VALUE
  }

  return responsive(
    size,
    () => value.full,
    () => value.compressed,
  )
}

/**
 * Replaces a text with a given value if a replacement is requested, otherwise
 * just return the .
 */
export const replaceTextIfRequested = (
  translation: LocaleMap<{ replacement?: ResponsiveTextReplace }> | undefined,
  valueToReplace: string,
  translateMap: TranslateMap,
  responsiveText: ResponsiveTextSize,
) =>
  mapNullable(translateMap(translation)?.replacement, replacement =>
    getResponsiveText(replacement, responsiveText).replace("$1", valueToReplace),
  ) ?? valueToReplace
