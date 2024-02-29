import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { andEvery, constant, not, orSome } from "./function.ts"

describe("constant", () => {
  it("returns a function that always returns the passed-in value as-is", () => {
    const x = {}
    assert.equal(constant(x)(), x)
  })
})

describe("andEvery", () => {
  it("returns a function that returns true if all predicates return true", () => {
    const isEven = (x: number) => x % 2 === 0
    const isPositive = (x: number) => x > 0
    const isEvenAndPositive = andEvery(isEven, isPositive)
    assert.equal(isEvenAndPositive(2), true)
    assert.equal(isEvenAndPositive(3), false)
    assert.equal(isEvenAndPositive(-2), false)
  })
})

describe("orSome", () => {
  it("returns a function that returns true if at least one predicate returns true", () => {
    const isEven = (x: number) => x % 2 === 0
    const isPositive = (x: number) => x > 0
    const isEvenAndPositive = orSome(isEven, isPositive)
    assert.equal(isEvenAndPositive(2), true)
    assert.equal(isEvenAndPositive(3), true)
    assert.equal(isEvenAndPositive(-3), false)
  })
})

describe("not", () => {
  it("returns a function that returns the negated result of the passed-in predicate", () => {
    const isEven = (x: number) => x % 2 === 0
    const isOdd = not(isEven)
    assert.equal(isOdd(2), false)
    assert.equal(isOdd(3), true)
  })
})
