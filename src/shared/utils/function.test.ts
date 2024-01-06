import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { constant } from "./function.ts"

describe("constant", () => {
  it("returns a function that always returns the passed-in value as-is", () => {
    const x = {}
    assert.equal(constant(x)(), x)
  })
})
