import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { ImprovementCost, adventurePointsForActivation, adventurePointsForDecrement, adventurePointsForIncrement, adventurePointsForRange, compareImprovementCost, equals, toString } from "./improvementCost.ts"

describe("adventurePointsForRange", () => {
  it("returns positive int on increase", () => {
    assert.equal(adventurePointsForRange(ImprovementCost.A, 4, 6), 2)
  })

  it("returns negative int on decrease", () => {
    assert.equal(adventurePointsForRange(ImprovementCost.A, 4, 2), -2)
  })

  it("returns positive int on multi increase above threshold", () => {
    assert.equal(adventurePointsForRange(ImprovementCost.C, 14, 16), 27)
  })

  it("returns negative int on multi decrease above threshold", () => {
    assert.equal(adventurePointsForRange(ImprovementCost.C, 14, 12), -15)
  })

  it("returns positive int on multi increase around threshold for E", () => {
    assert.equal(adventurePointsForRange(ImprovementCost.E, 13, 15), 45)
  })

  it("returns negative int on multi decrease for E", () => {
    assert.equal(adventurePointsForRange(ImprovementCost.E, 13, 11), -30)
  })

  it("returns positive int on multi increase above threshold for E", () => {
    assert.equal(adventurePointsForRange(ImprovementCost.E, 14, 16), 75)
  })

  it("returns negative int on multi decrease above threshold for E", () => {
    assert.equal(adventurePointsForRange(ImprovementCost.E, 15, 13), -45)
  })

  it("returns 0 for same value", () => {
    assert.equal(adventurePointsForRange(ImprovementCost.A, 4, 4), 0)
  })
})

describe("adventurePointsForIncrement", () => {
  it("returns flat cost", () => {
    assert.equal(adventurePointsForIncrement(ImprovementCost.A, 4), 1)
  })

  it("returns multiplied cost", () => {
    assert.equal(adventurePointsForIncrement(ImprovementCost.C, 14), 12)
  })

  it("returns flat cost for E", () => {
    assert.equal(adventurePointsForIncrement(ImprovementCost.E, 13), 15)
  })

  it("returns multiplied cost for E", () => {
    assert.equal(adventurePointsForIncrement(ImprovementCost.E, 14), 30)
  })
})

describe("adventurePointsForDecrement", () => {
  it("returns flat cost", () => {
    assert.equal(adventurePointsForDecrement(ImprovementCost.A, 4), -1)
  })

  it("returns multiplied cost", () => {
    assert.equal(adventurePointsForDecrement(ImprovementCost.C, 14), -9)
  })

  it("returns flat cost for E", () => {
    assert.equal(adventurePointsForDecrement(ImprovementCost.E, 14), -15)
  })

  it("returns multiplied cost for E", () => {
    assert.equal(adventurePointsForDecrement(ImprovementCost.E, 15), -30)
  })
})

describe("adventurePointsForActivation", () => {
  it("returns activation cost for A", () => {
    assert.equal(adventurePointsForActivation(ImprovementCost.A), 1)
  })

  it("returns activation cost for C", () => {
    assert.equal(adventurePointsForActivation(ImprovementCost.C), 3)
  })

  it("returns activation cost for E", () => {
    assert.equal(adventurePointsForActivation(ImprovementCost.E), 15)
  })
})

describe("compareImprovementCost", () => {
  it("returns the relative ordering of two improvement costs", () => {
    assert.equal(compareImprovementCost(ImprovementCost.A, ImprovementCost.B), -1)
    assert.equal(compareImprovementCost(ImprovementCost.B, ImprovementCost.B), 0)
    assert.equal(compareImprovementCost(ImprovementCost.B, ImprovementCost.A), 1)
  })
})

describe("equals", () => {
  it("returns if the two improvement costs are equal", () => {
    assert.equal(equals(ImprovementCost.A, ImprovementCost.B), false)
    assert.equal(equals(ImprovementCost.B, ImprovementCost.B), true)
  })
})

describe("toString", () => {
  it("returns the string representation of an improvement cost", () => {
    assert.equal(toString(ImprovementCost.A), "A")
    assert.equal(toString(ImprovementCost.D), "D")
  })
})
