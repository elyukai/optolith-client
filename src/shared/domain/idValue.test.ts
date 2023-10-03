import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { getSingleHighestPair } from "./idValue.ts"

describe(getSingleHighestPair.name, () => {
  it("returns undefined if there is no single highest pair", () => {
    assert.deepEqual(
      getSingleHighestPair([
        { id: 1, value: 8 },
        { id: 2, value: 9 },
        { id: 3, value: 9 },
      ]),
      undefined,
    )
  })

  it("returns the id/value object of the single highest pair", () => {
    assert.deepEqual(
      getSingleHighestPair([
        { id: 1, value: 8 },
        { id: 2, value: 8 },
        { id: 3, value: 9 },
      ]),
      { id: 3, value: 9 },
    )
    assert.deepEqual(
      getSingleHighestPair([
        { id: 1, value: 8 },
        { id: 3, value: 9 },
        { id: 3, value: 9 },
      ]),
      { id: 3, value: 9 },
    )
  })
})
