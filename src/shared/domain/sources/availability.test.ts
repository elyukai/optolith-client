import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { Publication } from "optolith-database-schema/types/source/Publication"
import { PublicationRefs } from "optolith-database-schema/types/source/_PublicationRef"
import { isEntryAvailable, isPublicationEnabled } from "./availability.ts"

const coreBook: Publication = {
  id: 1,
  category: "CoreRules",
  contains_adult_content: false,
  is_missing_implementation: false,
  translations: {},
}

const expansionRulesBook: Publication = {
  id: 2,
  category: "ExpansionRules",
  contains_adult_content: false,
  is_missing_implementation: false,
  translations: {},
}

const sourceBook: Publication = {
  id: 3,
  category: "Sourcebook",
  contains_adult_content: false,
  is_missing_implementation: false,
  translations: {},
}

const adultBook: Publication = {
  id: 4,
  category: "Sourcebook",
  contains_adult_content: true,
  is_missing_implementation: false,
  translations: {},
}

describe("isPublicationEnabled", () => {
  it("returns always true for core books", () => {
    assert.equal(isPublicationEnabled(coreBook, false, []), true)
  })

  it("returns true for non-adult books if all publications should be active by default", () => {
    assert.equal(isPublicationEnabled(expansionRulesBook, true, []), true)
    assert.equal(isPublicationEnabled(sourceBook, true, []), true)
  })

  it("returns false for adult books that are not explicitly activated if all publications should be active by default", () => {
    assert.equal(isPublicationEnabled(adultBook, true, []), false)
  })

  it("returns true for adult books that are explicitly activated if all publications should be active by default", () => {
    assert.equal(isPublicationEnabled(adultBook, true, [adultBook.id]), true)
  })

  it("returns false for non-core books that are not explicitly activated", () => {
    assert.equal(isPublicationEnabled(expansionRulesBook, false, []), false)
    assert.equal(isPublicationEnabled(sourceBook, false, []), false)
    assert.equal(isPublicationEnabled(adultBook, false, []), false)
  })

  it("returns true for non-core books that are explicitly activated", () => {
    assert.equal(isPublicationEnabled(expansionRulesBook, false, [expansionRulesBook.id]), true)
    assert.equal(isPublicationEnabled(sourceBook, false, [sourceBook.id]), true)
    assert.equal(isPublicationEnabled(adultBook, false, [adultBook.id]), true)
  })
})

const publications = {
  [coreBook.id]: coreBook,
  [expansionRulesBook.id]: expansionRulesBook,
  [sourceBook.id]: sourceBook,
  [adultBook.id]: adultBook,
}

const getPublicationById = (id: number) => publications[id]

describe("isEntryAvailable", () => {
  const refs1: PublicationRefs = [
    { id: { tag: "Publication", publication: coreBook.id }, occurrences: {} },
  ]

  const refs2: PublicationRefs = [
    { id: { tag: "Publication", publication: expansionRulesBook.id }, occurrences: {} },
  ]

  const refs3: PublicationRefs = [
    { id: { tag: "Publication", publication: expansionRulesBook.id }, occurrences: {} },
    { id: { tag: "Publication", publication: sourceBook.id }, occurrences: {} },
  ]

  const refs4: PublicationRefs = [
    { id: { tag: "Publication", publication: adultBook.id }, occurrences: {} },
  ]

  it("returns true if at least one listed publication is active", () => {
    assert.equal(isEntryAvailable(getPublicationById, false, [], refs1), true)
    assert.equal(isEntryAvailable(getPublicationById, true, [], refs2), true)
    assert.equal(isEntryAvailable(getPublicationById, true, [], refs3), true)
    assert.equal(isEntryAvailable(getPublicationById, false, [expansionRulesBook.id], refs2), true)
    assert.equal(isEntryAvailable(getPublicationById, false, [expansionRulesBook.id], refs3), true)
    assert.equal(
      isEntryAvailable(getPublicationById, false, [expansionRulesBook.id, sourceBook.id], refs3),
      true,
    )
    assert.equal(isEntryAvailable(getPublicationById, false, [sourceBook.id], refs3), true)
    assert.equal(isEntryAvailable(getPublicationById, false, [adultBook.id], refs4), true)
  })

  it("returns false if no listed publication is active", () => {
    assert.equal(isEntryAvailable(getPublicationById, false, [], refs2), false)
    assert.equal(isEntryAvailable(getPublicationById, false, [5, 6], refs2), false)
    assert.equal(isEntryAvailable(getPublicationById, false, [], refs3), false)
    assert.equal(isEntryAvailable(getPublicationById, false, [5, 6], refs3), false)
    assert.equal(isEntryAvailable(getPublicationById, false, [], refs4), false)
    assert.equal(isEntryAvailable(getPublicationById, false, [5, 6], refs4), false)
    assert.equal(isEntryAvailable(getPublicationById, true, [], refs4), false)
  })
})
