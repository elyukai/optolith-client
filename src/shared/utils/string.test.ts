import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { isNonEmptyString } from "./string.ts"

describe("isNonEmptyString", () => {
  it("returns false on undefined", () => assert.equal(isNonEmptyString(undefined), false))
  it("returns false on null", () => assert.equal(isNonEmptyString(null), false))
  it("returns false on an empty string", () => assert.equal(isNonEmptyString(""), false))
  it("returns true on a non-empty string", () => {
    assert.equal(isNonEmptyString("a"), true)
    assert.equal(isNonEmptyString("ab"), true)
    assert.equal(isNonEmptyString("abc"), true)
  })
})
