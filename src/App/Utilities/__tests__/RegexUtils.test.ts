import * as RegexUtils from "../RegexUtils"

describe ("isNatural", () => {
  it ("returns true on natural number", () => {
    expect (RegexUtils.isNaturalNumber ("2681")) .toBe (true)
  })

  it ("returns false on integer", () => {
    expect (RegexUtils.isNaturalNumber ("-2681")) .toBe (false)
  })

  it ("returns false on float", () => {
    expect (RegexUtils.isNaturalNumber ("2681.1")) .toBe (false)
  })
})

describe ("isInteger", () => {
  it ("returns true on natural number", () => {
    expect (RegexUtils.isInteger ("2681")) .toBe (true)
  })

  it ("returns true on integer", () => {
    expect (RegexUtils.isInteger ("-2681")) .toBe (true)
  })

  it ("returns false on float", () => {
    expect (RegexUtils.isInteger ("2681.1")) .toBe (false)
  })
})
