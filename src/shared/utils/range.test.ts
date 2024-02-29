import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { indexInRange, isInRange, range, rangeSize } from "./range.ts"

describe("range", () => {
  it("returns an array with all values between and including its bounds", () => {
    assert.deepEqual(range([3, 3]), [3])
    assert.deepEqual(range([3, 8]), [3, 4, 5, 6, 7, 8])
  })

  it("throws an errors if the upper bound is lower than the lower bound", () => {
    assert.throws(() => range([3, 2]))
  })
})

describe("isInRange", () => {
  it("returns if the value is within the specified range", () => {
    assert.equal(isInRange([1, 5], 1), true)
    assert.equal(isInRange([1, 5], 3), true)
    assert.equal(isInRange([1, 5], -1), false)
  })
})

describe("indexInRange", () => {
  it("returns if the value is within the specified bounds", () => {
    assert.equal(indexInRange([1, 5], 3), 2)
    assert.equal(indexInRange([1, 5], 1), 0)
  })

  it("throws if the value is not within the specified bounds", () => {
    assert.throws(() => indexInRange([1, 5], -1))
  })
})

describe("rangeSize", () => {
  it("returns a positive integer if the range is valid", () => {
    assert.equal(rangeSize([1, 5]), 5)
    assert.equal(rangeSize([1, 1]), 1)
  })

  it("returns 0 if the upper bound is smaller than the lower bound", () => {
    assert.equal(rangeSize([1, -2]), 0)
  })
})
