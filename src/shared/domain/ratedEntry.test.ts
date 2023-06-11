import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { ImprovementCost } from "./adventurePoints/improvementCost.ts"
import { Rated, createRatedHelpers } from "./ratedEntry.ts"

describe("createRatedHelpers", () => {
  const helpers = createRatedHelpers({
    minValue: 8,
    getImprovementCost: _ => ImprovementCost.E,
  })

  describe("create", () => {
    it("returns initial values if no optional values are provided", () => {
      assert.deepEqual<Rated>(
        helpers.create(1),
        {
          id: 1,
          value: 8,
          dependencies: [],
          cachedAdventurePoints: {
            general: 0,
            bound: 0,
          },
          boundAdventurePoints: [],
        },
      )
    })

    it("calculates adventure points cache if a specific rating is provided", () => {
      assert.deepEqual<Rated>(
        helpers.create(1, 9),
        {
          id: 1,
          value: 9,
          dependencies: [],
          cachedAdventurePoints: {
            general: 15,
            bound: 0,
          },
          boundAdventurePoints: [],
        },
      )
    })

    it("calculates adventure points cache if a specific rating and bound adventure points are provided", () => {
      assert.deepEqual<Rated>(
        helpers.create(1, 9, { boundAdventurePoints: [ { rating: 9, adventurePoints: 10 } ] }),
        {
          id: 1,
          value: 9,
          dependencies: [],
          cachedAdventurePoints: {
            general: 15,
            bound: 0,
          },
          boundAdventurePoints: [
            { rating: 9, adventurePoints: 10 },
          ],
        },
      )
      assert.deepEqual<Rated>(
        helpers.create(1, 9, { boundAdventurePoints: [ { rating: 8, adventurePoints: 10 } ] }),
        {
          id: 1,
          value: 9,
          dependencies: [],
          cachedAdventurePoints: {
            general: 5,
            bound: 10,
          },
          boundAdventurePoints: [
            { rating: 8, adventurePoints: 10 },
          ],
        },
      )
    })
  })

  describe("updateRating", () => {
    const oldEntry: Rated = {
      id: 1,
      value: 8,
      dependencies: [],
      cachedAdventurePoints: {
        general: 0,
        bound: 0,
      },
      boundAdventurePoints: [],
    }

    const oldEntryWithBound: Rated = {
      id: 1,
      value: 8,
      dependencies: [],
      cachedAdventurePoints: {
        general: 0,
        bound: 0,
      },
      boundAdventurePoints: [
        { rating: 8, adventurePoints: 10 },
      ],
    }

    it("returns updated rating and adventure points cache", () => {
      assert.deepEqual<Rated>(
        helpers.updateValue(oldRating => oldRating + 1, oldEntry),
        {
          id: 1,
          value: 9,
          dependencies: [],
          cachedAdventurePoints: {
            general: 15,
            bound: 0,
          },
          boundAdventurePoints: [],
        },
      )

      assert.deepEqual<Rated>(
        helpers.updateValue(oldRating => oldRating + 1, oldEntryWithBound),
        {
          id: 1,
          value: 9,
          dependencies: [],
          cachedAdventurePoints: {
            general: 5,
            bound: 10,
          },
          boundAdventurePoints: [
            { rating: 8, adventurePoints: 10 },
          ],
        },
      )
    })
  })

  describe("rating", () => {
    const oldEntry: Rated = {
      id: 1,
      value: 9,
      dependencies: [],
      cachedAdventurePoints: {
        general: 0,
        bound: 0,
      },
      boundAdventurePoints: [],
    }

    it("returns the rating if an entry is present", () => {
      assert.equal(helpers.value(oldEntry), 9)
    })

    it("returns the initial rating if no entry is present", () => {
      assert.equal(helpers.value(undefined), 8)
    })
  })
})
