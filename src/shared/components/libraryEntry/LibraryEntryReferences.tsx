import {
  Occurrence,
  Page,
  PublicationRefs,
  SimpleOccurrence,
  SimpleOccurrences,
  VersionedOccurrence,
} from "optolith-database-schema/types/source/_PublicationRef"
import { FC } from "react"
import { useAppSelector } from "../../../main_window/hooks/redux.ts"
import { selectStaticPublications } from "../../../main_window/slices/databaseSlice.ts"
import {
  PageRange,
  fromRawPageRange,
  normalizePageRanges,
  numberRangeToPageRange,
} from "../../domain/sources/pages.ts"
import { useTranslate } from "../../hooks/translate.ts"
import { useTranslateMap } from "../../hooks/translateMap.ts"
import { isNotNullish } from "../../utils/nullable.ts"
import { Translate } from "../../utils/translate.ts"
import { assertExhaustive } from "../../utils/typeSafety.ts"

type Props = {
  sources: PublicationRefs
}

const isSimpleOccurrence = (occurrence: Occurrence): occurrence is SimpleOccurrence =>
  Object.hasOwn(occurrence, "first_page")

const isSimpleOccurrences = (occurrence: Occurrence): occurrence is SimpleOccurrences =>
  Array.isArray(occurrence)

const isVersionedOccurrence = (occurrence: Occurrence): occurrence is VersionedOccurrence =>
  Object.hasOwn(occurrence, "initial")

const printPage = (translate: Translate, page: Page) => {
  switch (page.tag) {
    case "InsideCoverFront":
      return translate("Front Cover Inside")
    case "InsideCoverBack":
      return translate("Back Cover Inside")
    case "Numbered":
      return page.numbered.toString()
    default:
      return assertExhaustive(page)
  }
}

const printPageRange = (translate: Translate, pageRange: PageRange) =>
  pageRange.lastPage === undefined
    ? printPage(translate, pageRange.firstPage)
    : `${printPage(translate, pageRange.firstPage)}–${printPage(translate, pageRange.lastPage)}`

const printPageRanges = (translate: Translate, pageRanges: PageRange[]) =>
  pageRanges.map(pageRange => printPageRange(translate, pageRange)).join(", ")

/**
 * Displays the sources of an entry.
 */
export const LibraryEntryReferences: FC<Props> = ({ sources }) => {
  const translate = useTranslate()
  const translateMap = useTranslateMap()
  const publications = useAppSelector(selectStaticPublications)

  return (
    <p className="sources no-indent">
      {sources
        .map(source => {
          const publication = publications[source.id.publication]
          const publicationTranslations = translateMap(publication?.translations)
          const occurrences = translateMap(source.occurrences)

          if (
            publication === undefined ||
            publicationTranslations === undefined ||
            occurrences === undefined
          ) {
            return undefined
          }

          if (isSimpleOccurrence(occurrences)) {
            return `${publicationTranslations.name} ${printPageRange(
              translate,
              numberRangeToPageRange(occurrences),
            )}`
          }

          if (isSimpleOccurrences(occurrences)) {
            const ranges = normalizePageRanges(occurrences.map(numberRangeToPageRange))
            return `${publicationTranslations.name} ${printPageRanges(translate, ranges)}`
          }

          if (isVersionedOccurrence(occurrences)) {
            const initialPageRanges = normalizePageRanges(
              occurrences.initial.pages.map(fromRawPageRange),
            )

            const initial =
              occurrences.initial.printing === undefined
                ? printPageRanges(translate, initialPageRanges)
                : `${printPageRanges(translate, initialPageRanges)} (${translate(
                    "since the {0}. printing",
                    occurrences.initial.printing,
                  )})`

            const revisions =
              occurrences.revisions?.map(rev => {
                switch (rev.tag) {
                  case "Since": {
                    const pageRanges = normalizePageRanges(rev.since.pages.map(fromRawPageRange))
                    return `${printPageRanges(translate, pageRanges)} (${translate(
                      "since the {0}. printing",
                      rev.since.printing,
                    )})`
                  }
                  case "Deprecated": {
                    return translate("removed in {0}. printing", rev.deprecated.printing)
                  }
                  default:
                    return assertExhaustive(rev)
                }
              }) ?? []

            const allPageRanges = [initial, ...revisions].join("; ")

            return `${publicationTranslations.name} ${allPageRanges}`
          }

          return assertExhaustive(occurrences)
        })
        .filter(isNotNullish)
        .join("; ")}
    </p>
  )
}
