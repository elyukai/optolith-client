import assert from "node:assert/strict"
import { describe, it } from "node:test"
import {
  isNotNullish,
  isNullish,
  mapNullable,
  mapNullableDefault,
  nullableToArray,
} from "./nullable.ts"

describe("isNullish", () => {
  it("returns if a value is nullish", () => {
    assert.equal(isNullish(null), true)
    assert.equal(isNullish(undefined), true)
    assert.equal(isNullish(false), false)
    assert.equal(isNullish(0), false)
    assert.equal(isNullish(""), false)
  })
})

describe("isNotNullish", () => {
  it("returns if a value is not nullish", () => {
    assert.equal(isNotNullish(null), false)
    assert.equal(isNotNullish(undefined), false)
    assert.equal(isNotNullish(false), true)
    assert.equal(isNotNullish(0), true)
    assert.equal(isNotNullish(""), true)
  })
})

describe("mapNullable", () => {
  it("maps a value if it is not nullish", () => {
    assert.equal(
      mapNullable(2, x => x * 2),
      4,
    )
  })

  it("returns the original value if it is nullish", () => {
    assert.equal(
      mapNullable(undefined, x => x * 2),
      undefined,
    )
  })
})

describe("mapNullableDefault", () => {
  it("maps a value if it is not nullish", () => {
    assert.equal(
      mapNullableDefault(2, x => x * 2, 0),
      4,
    )
  })

  it("returns a default if the value is nullish", () => {
    assert.equal(
      mapNullableDefault(undefined, x => x * 2, 0),
      0,
    )
  })
})

describe("nullableToArray", () => {
  it("wraps a non-nullish value into an array", () => {
    assert.deepEqual(nullableToArray(2), [2])
  })

  it("returns an empty array if the value is null or undefined", () => {
    assert.deepEqual(nullableToArray(undefined), [])
    assert.deepEqual(nullableToArray(null), [])
  })
})
