import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { romanize } from "./roman.ts"

describe("romanize", () => {
  it("returns 0 on 0", () => assert.equal(romanize(0), "0"))
  it("returns I on 1", () => assert.equal(romanize(1), "I"))
  it("returns V on 5", () => assert.equal(romanize(5), "V"))
  it("returns IX on 9", () => assert.equal(romanize(9), "IX"))
  it("returns XVIII on 18", () => assert.equal(romanize(18), "XVIII"))
  it("returns −IX on -9", () => assert.equal(romanize(-9), "−IX"))
})
