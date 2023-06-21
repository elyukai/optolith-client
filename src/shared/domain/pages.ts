import { Page, PageRange as RawPageRange, SimpleOccurrence } from "optolith-database-schema/types/source/_PublicationRef"
import { range } from "../utils/array.ts"
import { Compare } from "../utils/sort.ts"
import { assertExhaustive } from "../utils/typeSafety.ts"

export const comparePage: Compare<Page> = (a, b) => {
  switch (a.tag) {
    case "InsideCoverFront": return b.tag === "InsideCoverFront"
      ? 0
      : -1
    case "InsideCoverBack": return b.tag === "InsideCoverBack"
      ? 0
      : 1
    case "Numbered": return b.tag === "Numbered"
      ? a.numbered - b.numbered
      : b.tag === "InsideCoverFront"
      ? 1
      : -1
    default: return assertExhaustive(a)
  }
}

export const equalsPage = (a: Page, b: Page): boolean =>
  comparePage(a, b) === 0

export const succ = (page: Page): Page => {
  switch (page.tag) {
    case "InsideCoverFront": return { tag: "Numbered", numbered: 1 }
    case "InsideCoverBack": return { tag: "InsideCoverFront", inside_cover_front: {} }
    case "Numbered": return { tag: "Numbered", numbered: page.numbered + 1 }
    default: return assertExhaustive(page)
  }
}

export const numberToPage = (number: number): Page =>
  ({ tag: "Numbered", numbered: number })

export type PageRange = {
  firstPage: Page
  lastPage?: Page
}

export const numberRangeToPageRange = (numberRange: SimpleOccurrence): PageRange =>
  numberRange.last_page === undefined
    ? ({ firstPage: numberToPage(numberRange.first_page) })
    : ({
      firstPage: numberToPage(numberRange.first_page),
      lastPage: numberToPage(numberRange.last_page),
    })

export const fromRawPageRange = (pageRange: RawPageRange): PageRange =>
  pageRange.last_page === undefined
    ? ({ firstPage: pageRange.first_page })
    : ({
      firstPage: pageRange.first_page,
      lastPage: pageRange.last_page,
    })

export const normalizePageRanges = (
  ranges: PageRange[],
): PageRange[] =>
  ranges
    .flatMap(({ firstPage, lastPage = firstPage }): Page[] => {
      if (firstPage.tag === "Numbered" && lastPage.tag === "Numbered") {
        return range(firstPage.numbered, lastPage.numbered)
          .map(numbered => ({ tag: "Numbered", numbered }))
      }
      else {
        return [ firstPage, lastPage ]
      }
    })
    .filter((page, i, pages) =>
      pages.findIndex(p => equalsPage(page, p)) === i)
    .sort(comparePage)
    .reduce<PageRange[]>(
      (acc, page): PageRange[] => {
        const lastRange = acc[acc.length - 1]

        if (lastRange === undefined) {
          return [ { firstPage: page } ]
        }

        const { firstPage, lastPage = firstPage } = lastRange

        if (equalsPage(page, succ(lastPage))) {
          return [ ...acc.slice(0, -1), { firstPage, lastPage: page } ]
        }

        return [ ...acc, { firstPage: page } ]
      },
      []
    )
