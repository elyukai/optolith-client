import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { isNotNullish, isNullish } from "./nullable.ts"

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
