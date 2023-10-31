import assert from "node:assert/strict"
import { describe, it } from "node:test"
import {
  arrayFromNonNullable,
  count,
  countBy,
  countByMany,
  ensureNonEmpty,
  filterNonNullable,
  partition,
  range,
  rangeSafe,
  reduceWhile,
  someCount,
  sum,
  sumWith,
  unique,
} from "./array.ts"

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

describe("sumWith", () => {
  it("returns 0 if the array is empty", () => {
    assert.equal(
      sumWith([], x => x * 2),
      0,
    )
  })

  it("returns the sum of all mapped numbers in the array", () => {
    assert.equal(
      sumWith([1], x => x * 2),
      2,
    )
    assert.equal(
      sumWith([1, 2], x => x * 2),
      6,
    )
    assert.equal(
      sumWith([1, 2, 3], x => x * 2),
      12,
    )
    assert.equal(
      sumWith([1, 2, 3, 4], x => x * 2),
      20,
    )
  })
})

describe("unique", () => {
  it("filters out duplicate values from an array", () => {
    assert.deepEqual(unique([]), [])
    assert.deepEqual(unique([1, 2, 3]), [1, 2, 3])
    assert.deepEqual(unique([1, 2, 1, 3]), [1, 2, 3])
  })
})

describe("ensureNonEmpty", () => {
  it("returns undefined if the array is empty", () => {
    assert.deepEqual(ensureNonEmpty([]), undefined)
  })

  it("returns the non-empty array as-is", () => {
    assert.deepEqual(ensureNonEmpty([1, 2]), [1, 2])
  })
})

describe("count", () => {
  it("returns how many elements satify the given predicate", () => {
    assert.equal(
      count([], x => x > 3),
      0,
    )
    assert.equal(
      count([0, 2, 3], x => x >= 3),
      1,
    )
    assert.equal(
      count([0, 2, 4, 6, 8], x => x > 3),
      3,
    )
  })
})

describe("countBy", () => {
  it("returns an empty object of the array is empty", () => {
    assert.deepEqual(
      countBy([], x => x % 2),
      {},
    )
  })
  it("returns for how many elements the function returns the same value", () => {
    assert.deepEqual(
      countBy([0, 2, 3], x => x % 2),
      { 0: 2, 1: 1 },
    )
    assert.deepEqual(
      countBy([0, 2, 4, 6, 8], x => x % 2),
      { 0: 5 },
    )
  })
})

describe("countByMany", () => {
  it("returns an empty object of the array is empty", () => {
    assert.deepEqual(
      countByMany([], x => [x, Math.round(x / 2), x % 2]),
      {},
    )
  })
  it("returns for how many elements the function returns the same value", () => {
    assert.deepEqual(
      countByMany([0, 2, 3], x => [x, Math.round(x / 2), x % 2]),
      { 0: 2, 1: 2, 2: 2, 3: 1 },
    )
    assert.deepEqual(
      countByMany([0, 2, 4, 6, 8], x => [x, Math.round(x / 2), x % 2]),
      { 0: 5, 1: 1, 2: 2, 3: 1, 4: 2, 6: 1, 8: 1 },
    )
  })
})

describe("partition", () => {
  it("splits all array elements into two separate arrays based on a predicate", () => {
    assert.deepEqual(
      partition([], x => x >= 3),
      [[], []],
    )
    assert.deepEqual(
      partition([0, 2, 3], x => x >= 3),
      [[3], [0, 2]],
    )
    assert.deepEqual(
      partition([0, 2, 4, 6, 8], x => x >= 3),
      [
        [4, 6, 8],
        [0, 2],
      ],
    )
  })

  it("keeps the original order of elements", () => {
    assert.deepEqual(
      partition([4, 8, 2, 7, 5, 6, 1, 3], x => x >= 3),
      [
        [4, 8, 7, 5, 6, 3],
        [2, 1],
      ],
    )
  })
})

describe("reduceWhile", () => {
  it("should return the initial value for an empty array", () => {
    const result = reduceWhile(
      [],
      (acc, value) => acc + value,
      () => false,
      10,
    )
    assert.equal(result, 10)
  })

  it("should correctly reduce the array", () => {
    const result = reduceWhile(
      [1, 2, 3, 4, 5],
      (acc, value) => acc + value,
      () => false,
      0,
    )
    assert.equal(result, 15)
  })

  it("should break early and return the correct value", () => {
    const result = reduceWhile(
      [1, 2, 3, 4, 5],
      (acc, value) => acc + value,
      acc => acc > 3,
      0,
    )
    assert.equal(result, 6)
  })
})

describe("someCount", () => {
  it("should return true if the array has the required minimum elements that satisfy the predicate", () => {
    const result = someCount([1, 2, 3, 4, 5], value => value > 2, 3)
    assert.equal(result, true)
  })

  it("should return false if the array does not have the required minimum elements that satisfy the predicate", () => {
    const result = someCount([1, 2, 3, 4, 5], value => value > 5, 3)
    assert.equal(result, false)
  })

  it("should return true for an array that has exactly the required number of elements satisfying the predicate", () => {
    const result = someCount([1, 2, 3, 4, 5], value => value > 3, 2)
    assert.equal(result, true)
  })

  it("should return false for an empty array", () => {
    const result = someCount([], value => value === 0, 2)
    assert.equal(result, false)
  })
})
