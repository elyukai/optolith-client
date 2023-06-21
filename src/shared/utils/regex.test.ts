import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { isEmptyOr, isFloat, isInteger, isNaturalNumber, isUrl } from "./regex.ts"

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

describe("isFloat", () => {
  it("returns if the passed string represents a floating-point number", () => {
    assert.equal(isFloat("0"), true)
    assert.equal(isFloat("1"), true)
    assert.equal(isFloat("39570"), true)
    assert.equal(isFloat("01"), false)
    assert.equal(isFloat("1.4"), true)
    assert.equal(isFloat("1,4"), true)
    assert.equal(isFloat("-1"), true)
    assert.equal(isFloat("NaN"), false)
  })
})

describe("isEmptyOr", () => {
  it("returns if the passed string is empty or passed the given test function", () => {
    assert.equal(isEmptyOr(isInteger, ""), true)
    assert.equal(isEmptyOr(isInteger, "0"), true)
    assert.equal(isEmptyOr(isInteger, "NaN"), false)
  })
})

describe("isUrl", () => {
  it("returns if the passed string is a valid url", () => {
    assert.equal(isUrl(""), false)
    assert.equal(isUrl("https://example.com"), true)
    assert.equal(isUrl("https://example.com:8080"), true)
    assert.equal(isUrl("https://example.com:8080/path"), true)
    assert.equal(isUrl("https://example.com:8080/path?query=string"), true)
    assert.equal(isUrl("https://example.com:8080/path?query=string#hash"), true)
    assert.equal(isUrl("file:///etc/path?query=string#hash"), true)
  })
})
