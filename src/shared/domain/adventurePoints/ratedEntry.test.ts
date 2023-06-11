import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { ImprovementCost } from "./improvementCost.ts"
import { RatedAdventurePointsCache, cachedAdventurePoints } from "./ratedEntry.ts"

describe("cachedAdventurePoints", () => {
  it("returns the calculated value if bound adventure points are only granted at at least the current rating", () => {
    assert.deepEqual<RatedAdventurePointsCache>(
      cachedAdventurePoints(
        9,
        8,
        [ { rating: 9, adventurePoints: 10 } ],
        ImprovementCost.E,
      ),
      {
        general: 15,
        bound: 0,
      },
    )
  })

  it("returns the split calculated value if bound adventure points have to be considered", () => {
    assert.deepEqual<RatedAdventurePointsCache>(
      cachedAdventurePoints(
        9,
        8,
        [ { rating: 8, adventurePoints: 10 } ],
        ImprovementCost.E,
      ),
      {
        general: 5,
        bound: 10,
      },
    )
  })
})
