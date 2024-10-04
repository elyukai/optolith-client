import { PublicationRefs } from "optolith-database-schema/types/source/_PublicationRef"
import { filterNonNullable } from "../utils/array.ts"
import { Compare } from "../utils/compare.ts"
import { Translate, TranslateMap } from "../utils/translate.ts"

/**
 * Creates a function that creates the JSON representation of the rules text for
 * a library entry.
 */
export const createLibraryEntryCreator =
  <T, A = undefined>(
    fn: LibraryEntryCreator<T, A, RawLibraryEntry>,
  ): LibraryEntryCreator<T | undefined, A> =>
  (entry, ...args) => {
    if (entry === undefined) {
      return () => undefined
    }

    return params => {
      const rawEntry = fn(entry, ...args)(params)

      if (rawEntry === undefined) {
        return undefined
      }

      return { ...rawEntry, content: filterNonNullable(rawEntry.content) }
    }
  }

/**
 * A function that creates the JSON representation of the rules text for a
 * library entry if given further params to the returned function.
 */
export type LibraryEntryCreator<T, A = undefined, R = LibraryEntry> = (
  entry: T,
  ...args: A extends undefined ? [] : [A]
) => LibraryEntryConfiguredCreator<R>

/**
 * A function that is already configures for a specific entity and returns the
 * JSON representation of the rules text for a ibrary entry.
 */
export type LibraryEntryConfiguredCreator<R = LibraryEntry> = (params: {
  translate: Translate
  translateMap: TranslateMap
  localeCompare: Compare<string>
}) => R | undefined

/**
 * A JSON representation of the rules text for a library entry.
 */
export type LibraryEntry = {
  title: string
  subtitle?: string
  className: string
  content: LibraryEntryContent[]
  src?: PublicationRefs
}

/**
 * A JSON representation of the rules text for a library entry that has not been
 * cleaned up.
 */
export type RawLibraryEntry = {
  title: string
  subtitle?: string
  className: string
  content: (LibraryEntryContent | undefined)[]
  src?: PublicationRefs
}

/**
 * A slice of the content of a library entry text.
 */
export type LibraryEntryContent = {
  label?: string
  value: string | number
  noIndent?: boolean
  className?: string
}
