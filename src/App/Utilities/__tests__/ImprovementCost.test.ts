import { getAPForActivatation, getAPForDec, getAPForInc, getAPForRange, icToStr, ImprovementCost } from "../ImprovementCost"

describe ("getAPForRange", () => {
  it ("returns positive int on increase", () => {
    expect (getAPForRange (ImprovementCost.A, 4, 6)).toBe (2)
  })

  it ("returns negative int on decrease", () => {
    expect (getAPForRange (ImprovementCost.A, 4, 2)).toBe (-2)
  })

  it ("returns positive int on multi increase above threshold", () => {
    expect (getAPForRange (ImprovementCost.C, 14, 16)).toBe (27)
  })

  it ("returns negative int on multi decrease above threshold", () => {
    expect (getAPForRange (ImprovementCost.C, 14, 12)).toBe (-15)
  })

  it ("returns positive int on multi increase around threshold for E", () => {
    expect (getAPForRange (ImprovementCost.E, 13, 15)).toBe (45)
  })

  it ("returns negative int on multi decrease for E", () => {
    expect (getAPForRange (ImprovementCost.E, 13, 11)).toBe (-30)
  })

  it ("returns positive int on multi increase above threshold for E", () => {
    expect (getAPForRange (ImprovementCost.E, 14, 16)).toBe (75)
  })
})

describe ("getAPForInc", () => {
  it ("returns flat cost", () => {
    expect (getAPForInc (ImprovementCost.A, 4)).toBe (1)
  })

  it ("returns multiplied cost", () => {
    expect (getAPForInc (ImprovementCost.C, 14)).toBe (12)
  })

  it ("returns flat cost for E", () => {
    expect (getAPForInc (ImprovementCost.E, 13)).toBe (15)
  })

  it ("returns multiplied cost for E", () => {
    expect (getAPForInc (ImprovementCost.E, 14)).toBe (30)
  })
})

describe ("getAPForDec", () => {
  it ("returns flat cost", () => {
    expect (getAPForDec (ImprovementCost.A, 4)).toBe (-1)
  })

  it ("returns multiplied cost", () => {
    expect (getAPForDec (ImprovementCost.C, 14)).toBe (-9)
  })

  it ("returns flat cost for E", () => {
    expect (getAPForDec (ImprovementCost.E, 14)).toBe (-15)
  })

  it ("returns multiplied cost for E", () => {
    expect (getAPForDec (ImprovementCost.E, 15)).toBe (-30)
  })
})

describe ("getAPForActivatation", () => {
  it ("returns activation cost for A", () => {
    expect (getAPForActivatation (ImprovementCost.A)).toBe (1)
  })

  it ("returns activation cost for C", () => {
    expect (getAPForActivatation (ImprovementCost.C)).toBe (3)
  })

  it ("returns activation cost for E", () => {
    expect (getAPForActivatation (ImprovementCost.E)).toBe (15)
  })
})

describe ("icToStr", () => {
  it ("returns name of A", () => {
    expect (icToStr (ImprovementCost.A)).toBe ("A")
  })

  it ("returns name of E", () => {
    expect (icToStr (ImprovementCost.E)).toBe ("E")
  })
})
