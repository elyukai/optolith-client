import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { even, odd, parseInt, parseNat, sign, signIgnoreZero, signStr } from "./math.ts"

describe("signIgnoreZero", () => {
  it("adds a typographic minus sign to a negative number", () => {
    assert.equal(signIgnoreZero(-1), "−\u20601")
  })

  it("adds a plus sign to a positive number", () => {
    assert.equal(signIgnoreZero(1), "+1")
  })

  it("returns undefined on zero", () => {
    assert.equal(signIgnoreZero(0), undefined)
  })
})

describe("sign", () => {
  it("adds a typographic minus sign to a negative number", () => {
    assert.equal(sign(-1), "−\u20601")
  })

  it("adds a plus sign to a positive number", () => {
    assert.equal(sign(1), "+1")
  })

  it("returns 0 on zero", () => {
    assert.equal(sign(0), "0")
  })
})

describe("signStr", () => {
  it("returns a typographic minus sign on a negative number", () => {
    assert.equal(signStr(-1), "−")
  })

  it("returns a plus sign on a positive number", () => {
    assert.equal(signStr(1), "+")
  })

  it("returns undefined on zero", () => {
    assert.equal(signStr(0), undefined)
  })
})

describe("parseInt", () => {
  it("parses a string that completely represents an integer", () => {
    assert.equal(parseInt("2"), 2)
    assert.equal(parseInt("-2"), -2)
    assert.equal(parseInt("10"), 10)
    assert.equal(parseInt("-10"), -10)
  })

  it("returns undefined if the full string does not represent an integer", () => {
    assert.equal(parseInt(""), undefined)
    assert.equal(parseInt(" 2"), undefined)
    assert.equal(parseInt("01"), undefined)
    assert.equal(parseInt("1.4"), undefined)
    assert.equal(parseInt("1,4"), undefined)
    assert.equal(parseInt("1n"), undefined)
    assert.equal(parseInt("NaN"), undefined)
  })
})

describe("parseNat", () => {
  it("parses a string that completely represents an integer", () => {
    assert.equal(parseNat("2"), 2)
    assert.equal(parseNat("10"), 10)
  })

  it("returns undefined if the full string does not represent an integer", () => {
    assert.equal(parseNat("-2"), undefined)
    assert.equal(parseNat("-10"), undefined)
    assert.equal(parseNat(""), undefined)
    assert.equal(parseNat(" 2"), undefined)
    assert.equal(parseNat("01"), undefined)
    assert.equal(parseNat("1.4"), undefined)
    assert.equal(parseNat("1,4"), undefined)
    assert.equal(parseNat("1n"), undefined)
    assert.equal(parseNat("NaN"), undefined)
  })
})

describe("even", () => {
  it("returns if the given number is even", () => {
    assert.equal(even(-4), true)
    assert.equal(even(-3), false)
    assert.equal(even(-2), true)
    assert.equal(even(-1), false)
    assert.equal(even(0), true)
    assert.equal(even(1), false)
    assert.equal(even(2), true)
    assert.equal(even(3), false)
    assert.equal(even(4), true)
  })
})

describe("odd", () => {
  it("returns if the given number is odd", () => {
    assert.equal(odd(-4), false)
    assert.equal(odd(-3), true)
    assert.equal(odd(-2), false)
    assert.equal(odd(-1), true)
    assert.equal(odd(0), false)
    assert.equal(odd(1), true)
    assert.equal(odd(2), false)
    assert.equal(odd(3), true)
    assert.equal(odd(4), false)
  })
})
