import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { compareDate } from "./date.ts"

describe("compareDate", () => {
  it("returns a negative value if the first date is earlier than the second date", () => {
    assert.equal(
      compareDate(new Date(2000, 0, 1, 12, 0, 0, 100), new Date(2000, 0, 1, 12, 0, 0, 200)),
      -100,
    )
  })

  it("returns a positive value if the first date is later than the second date", () => {
    assert.equal(
      compareDate(new Date(2000, 0, 1, 12, 0, 0, 300), new Date(2000, 0, 1, 12, 0, 0, 200)),
      100,
    )
  })

  it("returns zero if the first date is equal to the second date", () => {
    assert.equal(
      compareDate(new Date(2000, 0, 1, 12, 0, 0, 200), new Date(2000, 0, 1, 12, 0, 0, 200)),
      0,
    )
  })
})
