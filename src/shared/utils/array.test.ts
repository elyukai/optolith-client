import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { arrayFromNonNullable, filterNonNullable, range, rangeSafe, sum, unique } from "./array.ts"

describe("arrayFromNonNullable", () => {
  it("returns an array with null and undefined removed", () => {
    assert.deepEqual(arrayFromNonNullable(1, 2, null, 3, undefined, 4, 5), [1, 2, 3, 4, 5])
  })
})

describe("filterNonNullable", () => {
  it("returns an array with null and undefined removed", () => {
    assert.deepEqual(filterNonNullable([1, 2, null, 3, undefined, 4, 5]), [1, 2, 3, 4, 5])
  })
})

describe("range", () => {
  it("returns an array with all values between and including its bounds", () => {
    assert.deepEqual(range(3, 3), [3])
    assert.deepEqual(range(3, 8), [3, 4, 5, 6, 7, 8])
  })

  it("throws an errors if the upper bound is lower than the lower bound", () => {
    assert.throws(() => range(3, 2))
  })
})

describe("rangeSafe", () => {
  it("returns an array with all values between and including its bounds", () => {
    assert.deepEqual(rangeSafe(3, 3), [3])
    assert.deepEqual(rangeSafe(3, 8), [3, 4, 5, 6, 7, 8])
    assert.deepEqual(rangeSafe(8, 3), [3, 4, 5, 6, 7, 8])
  })
})

describe("sum", () => {
  it("returns 0 if the array is empty", () => {
    assert.equal(sum([]), 0)
  })

  it("returns the sum of all numbers in the array", () => {
    assert.equal(sum([1]), 1)
    assert.equal(sum([1, 2]), 3)
    assert.equal(sum([1, 2, 3]), 6)
    assert.equal(sum([1, 2, 3, 4]), 10)
  })
})

describe("unique", () => {
  it("filters out duplicate values from an array", () => {
    assert.deepEqual(unique([]), [])
    assert.deepEqual(unique([1, 2, 3]), [1, 2, 3])
    assert.deepEqual(unique([1, 2, 1, 3]), [1, 2, 3])
  })
})
