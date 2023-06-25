import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { compareAt, numAsc, reduceCompare } from "./compare.ts"

describe("compareAt", () => {
  it("builds a compare function for a nested value", () => {
    const compare1 = compareAt((x: { first: number; second: number }) => x.first, numAsc)
    assert.equal(
      compare1({ first: 3, second: 6 }, { first: 2, second: 2 }),
      1,
    )

    const compare2 = compareAt((x: { first: number; second: number }) => x.second, numAsc, true)
    assert.equal(
      compare2({ first: 3, second: 6 }, { first: 2, second: 2 }),
      -4,
    )
  })
})

describe("reduceCompare", () => {
  it("chains multiple comparison functions", () => {
    assert.deepEqual(
      [
        { first: 2, second: 6 },
        { first: 2, second: 2 },
        { first: 1, second: 2 },
        { first: 3, second: 1 },
        { first: 1, second: 6 },
        { first: 2, second: 3 },
      ].sort(reduceCompare(
        compareAt(x => x.first, numAsc),
        compareAt(x => x.second, numAsc, true),
      )),
      [
        { first: 1, second: 6 },
        { first: 1, second: 2 },
        { first: 2, second: 6 },
        { first: 2, second: 3 },
        { first: 2, second: 2 },
        { first: 3, second: 1 },
      ],
    )
  })
})
