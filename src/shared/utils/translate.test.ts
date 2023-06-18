import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { bytify } from "./translate.ts"

describe("bytify", () => {
  it("returns a human-readable approximation of the passed amount of bytes", () => {
    assert.equal(bytify(1234567, "de-DE", "en-GB"), "1,2 MB")
    assert.equal(bytify(1234567, "en-US", "en-GB"), "1.2 MB")
    assert.equal(bytify(1024, "en-US", "en-GB"), "1 KB")
    assert.equal(bytify(0, "de-DE", "en-GB"), "0 B")
  })
})
