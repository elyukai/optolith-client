import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { isInteger, isNaturalNumber } from "./regex.ts"

describe("isNaturalNumber", () => {
  it("returns if the passed string represents a natural number", () => {
    assert.equal(isNaturalNumber("0"), true)
    assert.equal(isNaturalNumber("1"), true)
    assert.equal(isNaturalNumber("39570"), true)
    assert.equal(isNaturalNumber("01"), false)
    assert.equal(isNaturalNumber("1.4"), false)
    assert.equal(isNaturalNumber("-1"), false)
    assert.equal(isNaturalNumber("NaN"), false)
  })
})

describe("isInteger", () => {
  it("returns if the passed string represents an integer", () => {
    assert.equal(isInteger("0"), true)
    assert.equal(isInteger("1"), true)
    assert.equal(isInteger("39570"), true)
    assert.equal(isInteger("01"), false)
    assert.equal(isInteger("1.4"), false)
    assert.equal(isInteger("-1"), true)
    assert.equal(isInteger("NaN"), false)
  })
})
