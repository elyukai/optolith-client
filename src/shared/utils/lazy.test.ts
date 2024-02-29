import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { Lazy } from "./lazy.ts"

describe("Lazy", () => {
  it("evaluates its value only when it is needed", () => {
    let evaluated = false
    const lazy = Lazy.of(() => {
      evaluated = true
      return 42
    })

    assert.equal(evaluated, false)
    assert.equal(lazy.value, 42)
    assert.equal(evaluated, true)
  })
})
